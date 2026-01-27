---
description: Verify Hoopla movie URLs using Playwright search
argument-hint: <movie-title>
allowed-tools: [Bash, Read, Write, Edit]
---

# Verify Hoopla Movie URL

Verify that a Hoopla movie URL points to the correct movie by searching Hoopla directly.

## Arguments

Movie title to verify: $ARGUMENTS

## Background

Hoopla URLs have the format: `hoopladigital.com/movie/{title-slug-actor-name}/{numeric-id}`

**Critical insight**: The title slug can look correct but the numeric ID determines which movie actually loads. Automated URL matching by title is unreliable because:
1. Different movies can have similar slugs
2. Hoopla's catalog changes frequently - movies get removed/replaced
3. The numeric ID is the only reliable identifier

## Instructions

### Step 1: Set Up Playwright (if needed)

Check if Playwright is installed in /tmp:

```bash
cd /tmp && ls package.json 2>/dev/null || (npm init -y && npm install playwright)
```

### Step 2: Create Search Script

Create `/tmp/hoopla-search.js` if it doesn't exist:

```javascript
const { chromium } = require('playwright');

async function searchHoopla(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `https://www.hoopladigital.com/search?q=${encodeURIComponent(query)}&kindId=7`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

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
          results.push({ href: 'https://www.hoopladigital.com' + href, title });
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
searchHoopla(query).then(results => {
  console.log(JSON.stringify(results, null, 2));
});
```

### Step 3: Search Hoopla

Run the search for the requested movie:

```bash
cd /tmp && node hoopla-search.js "MOVIE_TITLE"
```

### Step 4: Report Results

Report the correct URL found, comparing against any existing URL in the codebase.

**Key parameters:**
- `kindId=7` filters for movies only (not audiobooks, music, etc.)
- Wait 5 seconds for React to render search results
- Use `domcontentloaded` instead of `networkidle` (faster, more reliable)

## Example Usage

```
/verify-hoopla The Descent
/verify-hoopla "Escape Room"
/verify-hoopla Phantasm
```

## Lessons Learned

1. **Don't trust automated URL matching** - Hoopla URLs contain movie+actor, but matching by title alone is unreliable
2. **Always verify numeric IDs** - The slug can look correct but the ID determines what loads
3. **Hoopla catalog is dynamic** - Movies rotate in/out frequently
4. **WebFetch won't work** - Hoopla uses client-side rendering; you need Playwright to see actual content
