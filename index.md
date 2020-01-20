#### Articles
{% for page in site.articles %}
  <a href="{{ page.url }}">{{ page.title }}</a>  
{% endfor %}

#### Book Reviews
{% for page in site.books %}
  <a href="{{ page.url }}">{{ page.title }}</a>  
{% endfor %}
