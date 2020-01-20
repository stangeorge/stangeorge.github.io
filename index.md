[How I interview a Software Engineer](how-i-interview-a-software-engineer)


Learning the Go language by building over simple examples [https://stangeorge.github.io/learn-go/](https://stangeorge.github.io/learn-go/)


Articles on software and electronics [http://make.stanleygeorge.com](http://make.stanleygeorge.com)

<div class="posts">
  {% for post in site.posts %}
  <article class="post">    
    
    <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>

    <div class="entry">
      {{ post.content | truncatewords:40}}
    </div>
    
    <a href="{{ post.url }}" class="read-more">Read More</a>
  </article>
  {% endfor %}
</div>
