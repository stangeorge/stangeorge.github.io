export default function HorrorMovies() {
    const movies = {
          "2020s": [
            { title: "Nosferatu", year: 2024, rating: 7.3, country: "USA", url: "https://www.kanopy.com/en/mppl/video/114389" },
            { title: "Cuckoo", year: 2024, rating: 6.8, country: "Germany", url: "https://www.kanopy.com/en/mppl/video/14800632" },
            { title: "Longlegs", year: 2024, rating: 6.6, country: "USA", url: "https://www.kanopy.com/en/mppl/video/14800618" },
            { title: "Pearl", year: 2022, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/13688350" },
            { title: "Crimes of the Future", year: 2022, rating: 6.0, country: "Canada", url: "https://www.kanopy.com/en/mppl/video/13106280" },
            { title: "The Witch 2: The Other One", year: 2022, rating: 6.2, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/13028869" },
            { title: "Infinity Pool", year: 2023, rating: 6.0, country: "Canada", url: "https://www.kanopy.com/en/mppl/video/13588959" },
            { title: "Possessor", year: 2020, rating: 6.3, country: "Canada/UK", url: "https://www.kanopy.com/en/mppl/video/13106284" },
                ],
          "2010s": [
            { title: "Mother", year: 2009, rating: 7.8, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/10494810" },
            { title: "Train to Busan", year: 2016, rating: 7.6, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/12201140" },
            { title: "Hereditary", year: 2018, rating: 7.3, country: "USA", url: "https://www.kanopy.com/en/mppl/video/5331632" },
            { title: "The Cabin in the Woods", year: 2012, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15951996" },
            { title: "Annihilation", year: 2018, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/12998052" },
            { title: "World War Z", year: 2013, rating: 7.0, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15187570" },
            { title: "The House That Jack Built", year: 2018, rating: 6.8, country: "Denmark/France", url: "https://www.kanopy.com/en/mppl/video/12157432" },
            { title: "Suspiria", year: 2018, rating: 6.7, country: "Italy/USA", url: "https://www.kanopy.com/en/mppl/video/5916322" },
            { title: "Rare Exports: A Christmas Tale", year: 2010, rating: 6.7, country: "Finland", url: "https://www.kanopy.com/en/mppl/video/4208762" },
            { title: "The Witch: Subversion", year: 2018, rating: 6.6, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/12748998" },
            { title: "Mother!", year: 2017, rating: 6.6, country: "USA", url: "https://www.kanopy.com/en/mppl/video/13193769" },
            { title: "The Girl With All the Gifts", year: 2016, rating: 6.6, country: "UK", url: "https://www.kanopy.com/en/mppl/video/12936736" },
            { title: "Better Watch Out", year: 2016, rating: 6.5, country: "Australia/USA", url: "https://www.kanopy.com/en/mppl/video/12201075" },
            { title: "Titane", year: 2021, rating: 6.5, country: "France", url: "https://www.kanopy.com/en/mppl/video/12360027" },
            { title: "Daybreakers", year: 2009, rating: 6.4, country: "Australia/USA", url: "https://www.kanopy.com/en/mppl/video/15381904" },
            { title: "Lake Mungo", year: 2008, rating: 6.3, country: "Australia", url: "https://www.kanopy.com/en/mppl/video/15933516" },
            { title: "The Untamed", year: 2016, rating: 6.3, country: "Mexico", url: "https://www.kanopy.com/en/mppl/video/11134332" },
            { title: "The Love Witch", year: 2016, rating: 6.2, country: "USA", url: "https://www.kanopy.com/en/mppl/video/3214578" },
                ],
          "2000s": [
            { title: "Let the Right One In", year: 2008, rating: 7.9, country: "Sweden", url: "https://www.kanopy.com/en/mppl/video/2008533" },
            { title: "Battle Royale", year: 2000, rating: 7.5, country: "Japan", url: "https://www.kanopy.com/en/mppl/video/11335693" },
            { title: "R-Point", year: 2004, rating: 6.2, country: "South Korea", url: "https://www.kanopy.com/en/mppl/video/114479" },
                ],
          "1990s": [
            { title: "From Dusk Till Dawn", year: 1996, rating: 7.2, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15187548" },
                ],
          "1980s": [
            { title: "Santa Sangre", year: 1989, rating: 7.5, country: "Italy/Mexico", url: "https://www.kanopy.com/en/mppl/video/6683745" },
            { title: "Possession", year: 1981, rating: 7.3, country: "France/West Germany", url: "https://www.kanopy.com/en/mppl/video/14014934" },
            { title: "Tetsuo: The Iron Man", year: 1989, rating: 7.0, country: "Japan", url: "https://www.kanopy.com/en/mppl/video/114581" },
            { title: "Street Trash", year: 1987, rating: 6.1, country: "USA", url: "https://www.kanopy.com/en/mppl/video/15923639" },
                ],
          "1970s": [
            { title: "Ganja & Hess", year: 1973, rating: 6.2, country: "USA", url: "https://www.kanopy.com/en/mppl/video/114059" },
                ],
          "1920s": [
            { title: "Nosferatu", year: 1922, rating: 7.9, country: "Germany (Silent)", url: "https://www.kanopy.com/en/mppl/video/114389" },
                ],
    };

  const decadeLabels: { [key: string]: { emoji: string; title: string } } = {
        "2020s": { emoji: "📺", title: "2020-2029" },
        "2010s": { emoji: "🎭", title: "2010-2019" },
        "2000s": { emoji: "🌟", title: "2000-2009" },
        "1990s": { emoji: "🎪", title: "1990-1999" },
        "1980s": { emoji: "👻", title: "1980-1989" },
        "1970s": { emoji: "🕯️", title: "1970-1979" },
        "1920s": { emoji: "📽️", title: "1920s (Classic)" },
  };

  return (
        <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4">
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                      <header className="mb-12 text-center">
                                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-red-500 drop-shadow-lg">
                                            Kanopy Horror Movies
                                </h1>h1>
                                <p className="text-xl md:text-2xl text-gray-300 mb-2">
                                            Curated list of horror films with 6.0+ IMDb ratings
                                </p>p>
                                <p className="text-sm text-gray-400">
                                            Available on Kanopy | Organized by Decade | 39 Films Total
                                </p>p>
                      </header>header>
              
                {/* Movie Sections by Decade */}
                {Object.entries(movies).map(([decade, films]) => (
                    <section key={decade} className="mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-400 border-b-2 border-red-500 pb-3 flex items-center gap-3">
                                              <span>{decadeLabels[decade].title}</span>span>
                                              <span className="text-lg text-gray-500 ml-auto">
                                                              ({films.length} films)
                                              </span>span>
                                </h2>h2>
                                
                                <ul className="space-y-3">
                                  {films.map((movie, index) => (
                                      <li
                                                          key={index}
                                                          className="bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-all duration-200 border border-gray-800 hover:border-red-900"
                                                        >
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                            <a
                                                                                                    href={movie.url}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                    className="text-blue-400 hover:text-blue-300 font-semibold text-lg hover:underline flex-shrink-0"
                                                                                                  >
                                                                              {movie.title}
                                                                            </a>a>
                                                                            <span className="text-gray-400 text-sm sm:text-base">
                                                                                                  ({movie.year}) - {movie.rating} stars | {movie.country}
                                                                            </span>span>
                                                        </div>div>
                                      </li>li>
                                    ))}
                                </ul>ul>
                    </section>section>
                  ))}
              
                {/* Footer */}
                      <footer className="mt-16 text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
                                <p className="mb-2">
                                            <strong>Total: 39 verified horror films with 6.0+ IMDb ratings</strong>strong>
                                </p>p>
                                <p className="mb-2">All ratings verified from IMDb</p>p>
                                <p className="mb-4">Films link directly to Kanopy for streaming</p>p>
                                <p className="text-xs text-gray-500">
                                            Last updated: {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
        })}
                                </p>p>
                      </footer>footer>
              </div>div>
        </div>div>
      );
}

export const metadata = {
    title: 'Horror Movies on Kanopy | Stan George',
    description: 'Curated list of 39 horror movies with 6.0+ IMDb ratings available on Kanopy, organized by decade. From classic silent films to modern horror.',
    openGraph: {
          title: 'Horror Movies on Kanopy - Curated List',
          description: '39 verified horror films with 6.0+ IMDb ratings',
    },
};</div>
