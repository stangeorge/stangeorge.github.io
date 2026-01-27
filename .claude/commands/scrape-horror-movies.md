---
description: Scrape horror movies from Kanopy and Hoopla with verification
argument-hint: [kanopy|hoopla|both] [genre-url]
allowed-tools: [Bash, Read, Write, Edit]
---

# Scrape Horror Movies from Streaming Services

Extract horror movies from Kanopy and/or Hoopla, match against known ratings, and verify URLs.

## Arguments

- Service: $ARGUMENTS (kanopy, hoopla, or both)
- Optional: Genre URL to scrape

## Prerequisites

Ensure Playwright is installed:

```bash
cd /tmp && npm init -y 2>/dev/null; npm install playwright 2>/dev/null || true
```

## Workflow Overview

1. **Scrape** - Extract movie URLs from streaming service pages
2. **Match** - Compare against curated database of rated horror movies
3. **Verify** (Hoopla only) - Search Hoopla to confirm numeric IDs are correct
4. **Update** - Add verified movies to `app/horror-movies/page.tsx`

---

## CRITICAL: Hoopla URL Verification

**Problem**: Hoopla URLs have format `hoopladigital.com/movie/{title-slug-actor}/{numeric-id}`

The title slug can look correct but the **numeric ID determines which movie loads**. Automated scraping often gets wrong IDs because:
- Different movies can have similar slugs
- Hoopla's catalog changes frequently
- The same slug might point to different movies over time

**Solution**: Always verify Hoopla URLs by searching Hoopla directly.

---

## Part 1: Hoopla Scraping & Verification

### Step 1: Create Hoopla Search Script

Create `/tmp/hoopla-search.js`:

```javascript
const { chromium } = require('playwright');

async function searchHoopla(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // kindId=7 filters for movies only
    const url = `https://www.hoopladigital.com/search?q=${encodeURIComponent(query)}&kindId=7`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000); // Wait for React to render

    const links = await page.evaluate(() => {
      const results = [];
      const anchors = document.querySelectorAll('a[href*="/movie/"]');
      anchors.forEach(a => {
        const href = a.getAttribute('href');
        let title = '';
        const img = a.querySelector('img');
        if (img) title = img.alt || '';
        if (!title) title = a.textContent?.trim() || '';
        if (href && href.includes('/movie/')) {
          results.push({
            href: 'https://www.hoopladigital.com' + href,
            title
          });
        }
      });
      return results;
    });

    await browser.close();
    return links;
  } catch (e) {
    await browser.close();
    return { error: e.message };
  }
}

const query = process.argv[2];
if (!query) {
  console.log('Usage: node hoopla-search.js "Movie Title"');
  process.exit(1);
}
searchHoopla(query).then(results => {
  console.log(JSON.stringify(results, null, 2));
});
```

### Step 2: Create Hoopla Genre Scraper

Create `/tmp/hoopla-scrape-genre.js`:

```javascript
const { chromium } = require('playwright');

async function scrapeHooplaGenre(genreUrl, maxPages = 5) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const allMovies = [];

  try {
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = `${genreUrl}?page=${pageNum}`;
      console.error(`Scraping page ${pageNum}: ${url}`);

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      const movies = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('a[href*="/movie/"]').forEach(link => {
          const href = link.href;
          if (href.includes('/genre/') || href.includes('/categories/')) return;

          const urlMatch = href.match(/\/movie\/([^/]+)\/(\d+)$/);
          if (!urlMatch) return;

          const slug = urlMatch[1];
          const id = urlMatch[2];
          // Extract title from slug (remove last 2 words which are actor name)
          const slugParts = slug.split('-');
          const titleParts = slugParts.slice(0, -2);
          const title = titleParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

          results.push({ title, slug, id, url: href });
        });
        return results;
      });

      allMovies.push(...movies);

      if (movies.length === 0) break; // No more pages
      await page.waitForTimeout(1000);
    }

    await browser.close();

    // Deduplicate
    const seen = new Set();
    const unique = allMovies.filter(m => {
      if (seen.has(m.url)) return false;
      seen.add(m.url);
      return true;
    });

    return unique;
  } catch (e) {
    await browser.close();
    return { error: e.message };
  }
}

const genreUrl = process.argv[2] || 'https://www.hoopladigital.com/movie/genre/horror/320715898';
const maxPages = parseInt(process.argv[3]) || 5;

scrapeHooplaGenre(genreUrl, maxPages).then(results => {
  console.log(JSON.stringify(results, null, 2));
});
```

### Step 3: Verify Each Hoopla Movie

For each movie you want to add, **ALWAYS verify the URL**:

```bash
cd /tmp && node hoopla-search.js "The Descent"
```

Compare the returned ID with what you scraped. If different, use the ID from search results.

**Example verification:**
- Scraped URL: `/movie/the-descent-shauna-macdonald/11210020`
- Search result: `/movie/the-descent-shauna-macdonald/12024927`
- **Use**: `12024927` (from search)

---

## Part 2: Kanopy Scraping

### Kanopy URL Format

Kanopy URLs: `https://www.kanopy.com/en/[library]/video/[id]`

Example: `https://www.kanopy.com/en/sfpl/video/5477084`

### Create Kanopy Scraper

Create `/tmp/kanopy-scrape.js`:

```javascript
const { chromium } = require('playwright');

async function scrapeKanopyGenre(libraryCode, genrePath, maxPages = 5) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const allMovies = [];

  try {
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = `https://www.kanopy.com/en/${libraryCode}/category/${genrePath}?page=${pageNum}`;
      console.error(`Scraping: ${url}`);

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      const movies = await page.evaluate((lib) => {
        const results = [];
        document.querySelectorAll('a[href*="/video/"]').forEach(link => {
          const href = link.href;
          const match = href.match(/\/video\/(\d+)/);
          if (!match) return;

          const id = match[1];
          const titleEl = link.querySelector('[class*="title"]') || link;
          const title = titleEl.textContent?.trim() || '';

          if (title && id) {
            results.push({
              title,
              id,
              url: `https://www.kanopy.com/en/${lib}/video/${id}`
            });
          }
        });
        return results;
      }, libraryCode);

      allMovies.push(...movies);
      if (movies.length === 0) break;
      await page.waitForTimeout(1000);
    }

    await browser.close();

    const seen = new Set();
    return allMovies.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  } catch (e) {
    await browser.close();
    return { error: e.message };
  }
}

const libraryCode = process.argv[2] || 'sfpl';
const genrePath = process.argv[3] || 'horror';

scrapeKanopyGenre(libraryCode, genrePath).then(results => {
  console.log(JSON.stringify(results, null, 2));
});
```

**Usage:**
```bash
cd /tmp && node kanopy-scrape.js sfpl horror
```

---

## Part 3: Known Horror Movies Database

Match scraped movies against this curated database (excerpt - full list has 500+ entries):

```javascript
const KNOWN_HORROR_MOVIES = {
  // Format: "Title": [year, imdb_rating, country]
  "Hereditary": [2018, 7.3, "USA"],
  "The Descent": [2005, 7.2, "UK"],
  "Get Out": [2017, 7.8, "USA"],
  "The Thing": [1982, 8.2, "USA"],
  "Alien": [1979, 8.5, "UK/USA"],
  "The Shining": [1980, 8.4, "UK/USA"],
  "Psycho": [1960, 8.5, "USA"],
  "Rosemary's Baby": [1968, 8.0, "USA"],
  "The Exorcist": [1973, 8.1, "USA"],
  "Halloween": [1978, 7.7, "USA"],
  "A Nightmare on Elm Street": [1984, 7.4, "USA"],
  "Scream": [1996, 7.4, "USA"],
  "The Ring": [2002, 7.1, "USA"],
  "28 Days Later": [2002, 7.5, "UK"],
  "Let the Right One In": [2008, 7.8, "Sweden"],
  "Train to Busan": [2016, 7.6, "South Korea"],
  "It Follows": [2014, 6.8, "USA"],
  "The Babadook": [2014, 6.8, "Australia"],
  "Midsommar": [2019, 7.1, "USA/Sweden"],
  "The Lighthouse": [2019, 7.4, "USA/Canada"],
  // ... see scripts-archive/match-known-movies.ts for full list
};
```

Only add movies with rating >= 6.0.

---

## Part 4: Update Horror Movies Page

File: `app/horror-movies/page.tsx`

### Movie Type Structure

```typescript
type Movie = {
  title: string;
  year: number;
  rating: number;
  country: string;
  url: string;
  source: "kanopy" | "hoopla";
};
```

### Adding New Movies

Add to the appropriate decade in the `movies` object:

```typescript
const movies: Record<string, Movie[]> = {
  "2020s": [
    { title: "Talk to Me", year: 2022, rating: 7.1, country: "Australia",
      url: "https://www.hoopladigital.com/movie/talk-to-me-sophie-wilde/VERIFIED_ID",
      source: "hoopla" },
  ],
  "2000s": [
    { title: "The Descent", year: 2005, rating: 7.2, country: "UK",
      url: "https://www.hoopladigital.com/movie/the-descent-shauna-macdonald/12024927",
      source: "hoopla" },
  ],
  // ...
};
```

---

## Hoopla Genre URLs Reference

| Genre | URL |
|-------|-----|
| Horror | `https://www.hoopladigital.com/movie/genre/horror/320715898` |
| Sci-Fi | `https://www.hoopladigital.com/movie/genre/science-fiction/320715901` |
| Comedy | `https://www.hoopladigital.com/movie/genre/comedy/320715893` |
| Action | `https://www.hoopladigital.com/movie/genre/action/320715889` |
| Thriller | `https://www.hoopladigital.com/movie/genre/thriller/320715903` |

---

## Verification Checklist

Before committing new movies:

- [ ] Each Hoopla URL verified via search (`node hoopla-search.js "Title"`)
- [ ] Numeric IDs match search results (not scraped IDs)
- [ ] Movie rating >= 6.0 from IMDB
- [ ] No duplicate entries
- [ ] Build passes: `npm run build`
- [ ] Test links manually in browser

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Wrong movie loads | Numeric ID is wrong - verify via search |
| Page timeout | Use `domcontentloaded` not `networkidle` |
| Empty results | Increase `waitForTimeout` to 5000ms |
| Movie not found | May have been removed from catalog |
| WebFetch fails | Hoopla uses client-side rendering - must use Playwright |

---

## Example Full Workflow

```bash
# 1. Install playwright
cd /tmp && npm install playwright

# 2. Scrape Hoopla horror genre (first 5 pages)
node hoopla-scrape-genre.js "https://www.hoopladigital.com/movie/genre/horror/320715898" 5 > hoopla-raw.json

# 3. For each interesting movie, verify the URL
node hoopla-search.js "The Descent"
node hoopla-search.js "Phantasm"
node hoopla-search.js "Demons"

# 4. Update app/horror-movies/page.tsx with verified URLs

# 5. Build and test
npm run build
```
