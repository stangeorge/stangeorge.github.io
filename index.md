#### Articles
{% for article in site.articles %}
  <a href="{{ article.url }}">{{ article.title }}</a>  
{% endfor %}

#### Book Reviews
{% for book in site.books %}
  <a href="{{ book.url }}">{{ book.title }}</a>  
{% endfor %}

<a href ="https://stangeorge.github.io/atom.xml">RSS</a>
