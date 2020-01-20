<div class="pages">
  {% for page in site.pages %}
  <article class="page">    
    
    <h1><a href="{{ page.url }}">{{ page.title }}</a></h1>

    <div class="entry">
      {{ page.content | truncatewords:40}}
    </div>
    
    <a href="{{ page.url }}" class="read-more">Read More</a>
  </article>
  {% endfor %}
</div>
