#### Articles
{% for article in site.articles %}
<a href="{{ article.url }}">{{ article.title }}</a>
{% endfor %}

#### Book Reviews
{% assign sortedBooks = site.books | sort: 'title' %}
{% for book in sortedBooks %}
<a href="{{ book.url }}">{{ book.title }}</a>
{% endfor %}
