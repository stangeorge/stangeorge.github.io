[How I interview a Software Engineer](how-i-interview-a-software-engineer)


Learning the Go language by building over simple examples [https://stangeorge.github.io/learn-go/](https://stangeorge.github.io/learn-go/)


Articles on software and electronics [http://make.stanleygeorge.com](http://make.stanleygeorge.com)

<div class="pages">
  {% for post in site.pages %}
  <article class="page">    
    
    <h1><a href="{{ page.url }}">{{ page.title }}</a></h1>

    <div class="entry">
      {{ page.content | truncatewords:40}}
    </div>
    
    <a href="{{ page.url }}" class="read-more">Read More</a>
  </article>
  {% endfor %}
</div>
