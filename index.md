#### Articles
{% for article in site.articles %}
<a href="{{ article.url }}">{{ article.title }}</a>
{% endfor %}

#### I liked these fiction books
* C.S. Lewis - Chronicles of Narnia
* Carlos Ruiz Zafón - The Shadow of the Wind, The Angel's Game, The Prisoner of Heaven, Marina  
* Delia Owens - Where the Crawdads Sing
* Ernest Hemingway - The Old Man and the Sea, The Sun Also Rises
* Frank Herbert - Dune  
* Isaac Asimov - Foundation, Foundation and Empire, Second Foundation, Forward the Foundation, Foundation And Earth,  Foundation’s Edge, Gold - The Final Science Fiction Collection, I, Robot, Prelude To Foundation, The Caves of Steel, The Naked Sun  
* J.K. Rowling: Harry Potter
* J.R.R. Tolkien: The Lord of the Rings  
* Leigh Bardugo - Six of Crows
* M. L. Stedman - The Light Between Oceans  
* Marcus Zusak - The Book Thief  
* Tara Westover - Educated  
* Ursula K. Le Guin - A Wizard of Earthsea, The Tombs of Atuan, The Farthest Shore, Tehanu, The Other Wind  

#### I liked these non-fiction books

* Ashlee Vance - Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future  
* Brad Stone - The Everything Store: Jeff Bezos and the Age of Amazon  
* Hope Jahren - Lab Girl  
* Kim Scott - Radical Candor  
* Patrick M. Lencioni - The Five Dysfunctions of a Team: A Leadership Fable  
* Phil Knight - Shoe Dog


#### Book Reviews
{% assign sortedBooks = site.books | sort: 'title' %}
{% for book in sortedBooks %}
<a href="{{ book.url }}">{{ book.title }}</a>
{% endfor %}
