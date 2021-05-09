#### Articles
{% for article in site.articles %}
<a href="{{ article.url }}">{{ article.title }}</a>
{% endfor %}

#### I liked these books
* Carlos Ruiz Zafón - The Shadow of the Wind, The Angel's Game, The Prisoner of Heaven, Marina  
* Ernest Hemingway - The Old Man and the Sea, The Sun Also Rises  
* Isaac Asimov - Foundation, Foundation and Empire, Second Foundation, Forward the Foundation, Foundation And Earth,  Foundation’s Edge, Gold - The Final Science Fiction Collection, I, Robot, Prelude To Foundation, The Caves of Steel, The Naked Sun  
* M. L. Stedman - The Light Between Oceans  
* Marcus Zusak - The Book Thief  
* Tara Westover - Educated  
* Ursula K. Le Guin - A Wizard of Earthsea, The Tombs of Atuan, The Farthest Shore, Tehanu, The Other Wind  

#### Book Reviews
{% assign sortedBooks = site.books | sort: 'title' %}
{% for book in sortedBooks %}
<a href="{{ book.url }}">{{ book.title }}</a>
{% endfor %}
