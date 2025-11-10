export default function Reading() {
  const fictionBooks = [
    'Dune - Frank Herbert',
    'Foundation - Isaac Asimov',
    'Foundation and Empire - Isaac Asimov',
    'Second Foundation - Isaac Asimov',
    "Foundation's Edge - Isaac Asimov",
    'Foundation and Earth - Isaac Asimov',
    'Prelude to Foundation - Isaac Asimov',
    'Forward the Foundation - Isaac Asimov',
    'I, Robot - Isaac Asimov',
    'The Caves of Steel - Isaac Asimov',
    'The Naked Sun - Isaac Asimov',
    "The Handmaid's Tale - Margaret Atwood",
    'The Book Thief - Marcus Zusak',
    'The Sun Also Rises - Ernest Hemingway',
    'The Old Man and the Sea - Ernest Hemingway',
    'Catch-22 - Joseph Heller',
    'Slaughterhouse-Five - Kurt Vonnegut',
    "The Hitchhiker&apos;s Guide to the Galaxy - Douglas Adams",
    'Ender&apos;s Game - Orson Scott Card',
    'The Martian - Andy Weir',
  ]

  const nonFictionBooks = [
    'Lab Girl - Hope Jahren',
    'Sapiens - Yuval Noah Harari',
    'The Design of Everyday Things - Don Norman',
    'Thinking, Fast and Slow - Daniel Kahneman',
  ]

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Reading</h1>
        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          Books I&apos;ve enjoyed over the years. Mostly science fiction with some non-fiction mixed in.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
          Fiction
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fictionBooks.map((book) => (
            <li key={book} className="text-gray-700 dark:text-gray-300">
              {book}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
          Non-Fiction
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nonFictionBooks.map((book) => (
            <li key={book} className="text-gray-700 dark:text-gray-300">
              {book}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
