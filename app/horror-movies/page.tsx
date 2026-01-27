export default function HorrorMovies() {
  type Movie = {
    title: string;
    year: number;
    rating: number;
    country: string;
    url: string;
    source: "kanopy" | "hoopla";
  };

  const movies: Record<string, Movie[]> = {
    "2020s": [
      { title: "Nosferatu", year: 2024, rating: 7.3, country: "USA", url: "https://www.kanopy.com/en/mppl/video/114389", source: "kanopy" },
      { title: "Cuckoo", year: 2024, rating: 6.8, country: "Germany", url: "https://www.kanopy.com/en/mppl/video/14800632", source: "kanopy" },
      { title: "Longlegs", year: 2024, rating: 6.6, country: "USA", url: "https://www.kanopy.com/en/mppl/video/14800618", source: "kanopy" },
      { title: "Pearl", year: 2022, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/13688350", source: "kanopy" },
      { title: "Crimes of the Future", year: 2022, rating: 6.0, country: "Canada", url: "https://www.kanopy.com/en/mppl/video/13106280", source: "kanopy" },
      { title: "The Witch 2: The Other One", year: 2022, rating: 6.2, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/13028869", source: "kanopy" },
      { title: "Infinity Pool", year: 2023, rating: 6.0, country: "Canada", url: "https://www.kanopy.com/en/mppl/video/13588959", source: "kanopy" },
      { title: "Possessor", year: 2020, rating: 6.3, country: "Canada/UK", url: "https://www.kanopy.com/en/mppl/video/13106284", source: "kanopy" },
    ],
    "2010s": [
      { title: "Mother", year: 2009, rating: 7.8, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/10494810", source: "kanopy" },
      { title: "Train to Busan", year: 2016, rating: 7.6, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/12201140", source: "kanopy" },
      { title: "Tucker and Dale vs Evil", year: 2010, rating: 7.5, country: "Canada", url: "https://www.hoopladigital.com/movie/tucker-and-dale-vs-evil-tyler-labine/11049557", source: "hoopla" },
      { title: "Hereditary", year: 2018, rating: 7.3, country: "USA", url: "https://www.kanopy.com/en/mppl/video/5331632", source: "kanopy" },
      { title: "The Cabin in the Woods", year: 2012, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15951996", source: "kanopy" },
      { title: "Annihilation", year: 2018, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/12998052", source: "kanopy" },
      { title: "World War Z", year: 2013, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15187570", source: "kanopy" },
      { title: "The House That Jack Built", year: 2018, rating: 6.8, country: "Denmark/France", url: "https://www.kanopy.com/en/mppl/video/12157432", source: "kanopy" },
      { title: "Suspiria", year: 2018, rating: 6.7, country: "Italy/USA", url: "https://www.kanopy.com/en/mppl/video/5916322", source: "kanopy" },
      { title: "Rare Exports: A Christmas Tale", year: 2010, rating: 6.7, country: "Finland", url: "https://www.kanopy.com/en/mppl/video/4208762", source: "kanopy" },
      { title: "The Witch: Subversion", year: 2018, rating: 6.6, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/12748998", source: "kanopy" },
      { title: "Mother!", year: 2017, rating: 6.6, country: "USA", url: "https://www.kanopy.com/en/mppl/video/13193769", source: "kanopy" },
      { title: "The Girl With All the Gifts", year: 2016, rating: 6.6, country: "UK", url: "https://www.kanopy.com/en/mppl/video/12936736", source: "kanopy" },
      { title: "Better Watch Out", year: 2016, rating: 6.5, country: "Australia/USA", url: "https://www.kanopy.com/en/mppl/video/12201075", source: "kanopy" },
      { title: "Titane", year: 2021, rating: 6.5, country: "France", url: "https://www.kanopy.com/en/mppl/video/12360027", source: "kanopy" },
      { title: "Daybreakers", year: 2009, rating: 6.4, country: "Australia/USA", url: "https://www.kanopy.com/en/mppl/video/15381904", source: "kanopy" },
      { title: "Lake Mungo", year: 2008, rating: 6.3, country: "Australia", url: "https://www.kanopy.com/en/mppl/video/15933516", source: "kanopy" },
      { title: "The Untamed", year: 2016, rating: 6.3, country: "Mexico", url: "https://www.kanopy.com/en/mppl/video/11134332", source: "kanopy" },
      { title: "The Love Witch", year: 2016, rating: 6.2, country: "USA", url: "https://www.kanopy.com/en/mppl/video/3214578", source: "kanopy" },
    ],
    "2000s": [
      { title: "Let the Right One In", year: 2008, rating: 7.9, country: "Sweden", url: "https://www.kanopy.com/en/mppl/video/2008533", source: "kanopy" },
      { title: "Battle Royale", year: 2000, rating: 7.5, country: "Japan", url: "https://www.kanopy.com/en/mppl/video/11335693", source: "kanopy" },
      { title: "The Descent", year: 2005, rating: 7.2, country: "UK", url: "https://www.hoopladigital.com/movie/the-descent-shauna-macdonald/11210020", source: "hoopla" },
      { title: "Noroi: The Curse", year: 2005, rating: 7.1, country: "Japan", url: "https://www.hoopladigital.com/movie/noroi-the-curse-jin-muraki/16573526", source: "hoopla" },
      { title: "A Tale of Two Sisters", year: 2003, rating: 7.1, country: "South Korea", url: "https://www.hoopladigital.com/movie/a-tale-of-two-sisters-lim-su-jeong/11049549", source: "hoopla" },
      { title: "Inside", year: 2007, rating: 7.0, country: "France", url: "https://www.hoopladigital.com/movie/inside-alysson-paradis/11028918", source: "hoopla" },
      { title: "Shutter", year: 2004, rating: 7.0, country: "Thailand", url: "https://www.hoopladigital.com/movie/shutter-ananda-everingham/15378013", source: "hoopla" },
      { title: "Incident at Loch Ness", year: 2004, rating: 6.6, country: "USA/UK", url: "https://www.hoopladigital.com/movie/incident-at-loch-ness-werner-herzog/12268003", source: "hoopla" },
      { title: "Pulse", year: 2001, rating: 6.5, country: "Japan", url: "https://www.hoopladigital.com/movie/pulse-kumiko-aso/11049579", source: "hoopla" },
      { title: "The Collector", year: 2009, rating: 6.4, country: "USA", url: "https://www.hoopladigital.com/movie/the-collector-josh-stewart/11087167", source: "hoopla" },
      { title: "R-Point", year: 2004, rating: 6.2, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/114479", source: "kanopy" },
      { title: "Scary Movie", year: 2000, rating: 6.2, country: "USA", url: "https://www.hoopladigital.com/movie/scary-movie-anna-faris/12183256", source: "hoopla" },
    ],
    "1990s": [
      { title: "Audition", year: 1999, rating: 7.2, country: "Japan", url: "https://www.hoopladigital.com/movie/audition-ryo-ishibashi/15375970", source: "hoopla" },
      { title: "From Dusk Till Dawn", year: 1996, rating: 7.2, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15187548", source: "kanopy" },
      { title: "What Lies Beneath", year: 1999, rating: 6.6, country: "USA", url: "https://www.hoopladigital.com/movie/what-lies-beneath-harrison-ford/11519903", source: "hoopla" },
    ],
    "1980s": [
      { title: "Santa Sangre", year: 1989, rating: 7.5, country: "Italy/Mexico", url: "https://www.kanopy.com/en/mppl/video/6683745", source: "kanopy" },
      { title: "Possession", year: 1981, rating: 7.3, country: "France/West Germany", url: "https://www.kanopy.com/en/mppl/video/14014934", source: "kanopy" },
      { title: "Day of the Dead", year: 1985, rating: 7.2, country: "USA", url: "https://www.hoopladigital.com/movie/day-of-the-dead-lori-cardille/15377816", source: "hoopla" },
      { title: "Tetsuo: The Iron Man", year: 1989, rating: 7.0, country: "Japan", url: "https://www.kanopy.com/en/mppl/video/114581", source: "kanopy" },
      { title: "Demons", year: 1985, rating: 6.7, country: "Italy", url: "https://www.hoopladigital.com/movie/demons-urbano-barberini/15377817", source: "hoopla" },
      { title: "The Howling", year: 1981, rating: 6.6, country: "USA", url: "https://www.hoopladigital.com/movie/the-howling-dee-wallace/15377959", source: "hoopla" },
      { title: "Maniac", year: 1980, rating: 6.4, country: "USA", url: "https://www.hoopladigital.com/movie/maniac-joe-spinell/15377962", source: "hoopla" },
      { title: "Street Trash", year: 1987, rating: 6.1, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15923639", source: "kanopy" },
      { title: "Cujo", year: 1983, rating: 6.1, country: "USA", url: "https://www.hoopladigital.com/movie/cujo-dee-wallace/18037632", source: "hoopla" },
      { title: "The Lair of the White Worm", year: 1988, rating: 6.0, country: "UK", url: "https://www.hoopladigital.com/movie/the-lair-of-the-white-worm-amanda-donohoe/14625319", source: "hoopla" },
    ],
    "1970s": [
      { title: "The Bird with the Crystal Plumage", year: 1970, rating: 7.0, country: "Italy", url: "https://www.hoopladigital.com/movie/the-bird-with-the-crystal-plumage-tony-musante/12418022", source: "hoopla" },
      { title: "Phantasm", year: 1979, rating: 6.6, country: "USA", url: "https://www.hoopladigital.com/movie/phantasm-a-michael-baldwin/17631046", source: "hoopla" },
      { title: "Horror Express", year: 1972, rating: 6.5, country: "Spain/UK", url: "https://www.hoopladigital.com/movie/horror-express-christopher-lee/17693968", source: "hoopla" },
      { title: "Ganja & Hess", year: 1973, rating: 6.2, country: "USA", url: "https://www.kanopy.com/en/mppl/video/114059", source: "kanopy" },
    ],
    "1960s": [
      { title: "Blood and Black Lace", year: 1964, rating: 7.0, country: "Italy", url: "https://www.hoopladigital.com/movie/blood-and-black-lace-cameron-mitchell/17705594", source: "hoopla" },
      { title: "Carnival of Souls", year: 1962, rating: 7.0, country: "USA", url: "https://www.hoopladigital.com/movie/carnival-of-souls-candace-hilligoss/12305706", source: "hoopla" },
    ],
    "1920s": [
      { title: "The Cabinet of Dr. Caligari", year: 1920, rating: 8.0, country: "Germany", url: "https://www.hoopladigital.com/movie/the-cabinet-of-dr-caligari-werner-krauss/17033482", source: "hoopla" },
      { title: "Nosferatu", year: 1922, rating: 7.9, country: "Germany (Silent)", url: "https://www.kanopy.com/en/mppl/video/114389", source: "kanopy" },
    ],
  };

  // Sort each decade by rating (highest first)
  Object.keys(movies).forEach((decade) => {
    movies[decade].sort((a, b) => b.rating - a.rating);
  });

  // Calculate totals
  const kanopyCount = Object.values(movies)
    .flat()
    .filter((m) => m.source === "kanopy").length;
  const hooplaCount = Object.values(movies)
    .flat()
    .filter((m) => m.source === "hoopla").length;
  const totalCount = kanopyCount + hooplaCount;

  const decadeLabels: { [key: string]: { emoji: string; title: string } } = {
    "2020s": { emoji: "📺", title: "2020-2029" },
    "2010s": { emoji: "🎭", title: "2010-2019" },
    "2000s": { emoji: "🌟", title: "2000-2009" },
    "1990s": { emoji: "🎪", title: "1990-1999" },
    "1980s": { emoji: "👻", title: "1980-1989" },
    "1970s": { emoji: "🕯️", title: "1970-1979" },
    "1960s": { emoji: "🎬", title: "1960-1969" },
    "1920s": { emoji: "📽️", title: "1920s (Silent)" },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-red-500 drop-shadow-lg">
            Horror Movies
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Curated list of horror films with 6.0+ IMDb ratings
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Available on Kanopy & Hoopla | Organized by Decade | {totalCount} Films Total
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700">
              K = Kanopy ({kanopyCount})
            </span>
            <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full border border-purple-700">
              H = Hoopla ({hooplaCount})
            </span>
          </div>
        </header>

        {/* Movie Sections by Decade */}
        {Object.entries(movies).map(([decade, films]) => (
          <section key={decade} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-400 border-b-2 border-red-500 pb-3 flex items-center gap-3">
              <span>{decadeLabels[decade]?.title || decade}</span>
              <span className="text-lg text-gray-500 ml-auto">
                ({films.length} films)
              </span>
            </h2>

            <ul className="space-y-3">
              {films.map((movie, index) => (
                <li
                  key={index}
                  className="bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-all duration-200 border border-gray-800 hover:border-red-900"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded ${
                        movie.source === "kanopy"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                          : "bg-purple-900/50 text-purple-300 border border-purple-700"
                      }`}
                    >
                      {movie.source === "kanopy" ? "K" : "H"}
                    </span>
                    <a
                      href={movie.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold text-lg hover:underline flex-shrink-0"
                    >
                      {movie.title}
                    </a>
                    <span className="text-gray-400 text-sm sm:text-base">
                      ({movie.year}) - {movie.rating} stars | {movie.country}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
          <p className="mb-2">
            <strong>
              Total: {totalCount} verified horror films with 6.0+ IMDb ratings
            </strong>
          </p>
          <p className="mb-2">All ratings verified from IMDb</p>
          <p className="mb-4">
            Films link directly to Kanopy or Hoopla for streaming
          </p>
          <p className="text-xs text-gray-500">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </footer>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Horror Movies on Kanopy & Hoopla | Stan George",
  description:
    "Curated list of horror movies with 6.0+ IMDb ratings available on Kanopy and Hoopla, organized by decade. From silent films to modern horror.",
  openGraph: {
    title: "Horror Movies on Kanopy & Hoopla - Curated List",
    description: "Verified horror films with 6.0+ IMDb ratings from free streaming libraries",
  },
};
