#### Articles
{% for article in site.articles %}
  <a href="{{ article.url }}">{{ article.title }}</a>  
{% endfor %}

#### My favorite books
* Non-Fiction
  * Lab Girl by Hope Jahren
  * The Theory of Everything by Stephen Hawking
* Science-Fiction
  * Foundation Trilogy by Isaac Asimov
  * A Wizard of Earthsea by Ursula K. Le Guin
* Fiction
  * The Book Thief by Marcus Zusak
  * [The Shadow of the Wind](_books/the-shadow-of-the-wind.md) by Carlos Ruiz Zafón
  * The Shell Collector: Stories by Anthony Doerr
* Classics
  * Don Quixote by Miguel de Cervantes
  * The Count of Monte Cristo by Alexandre Dumas
  * The Old Man and the Sea by Ernest Hemingway
* Children's Books
  * Molly's Pilgrim by Barbara Cohen


#### Book Reviews
{% for book in site.books %}
  <a href="{{ book.url }}">{{ book.title }}</a>  
{% endfor %}
