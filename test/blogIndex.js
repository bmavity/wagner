define('blogIndex', [], function() {
  var $parent = $('#posts'),
      $template = $('#postTemplate').children();
  exports.displayPosts = function(posts) {
    posts.forEach(function(post) {
      $parent.append($template.clone().inject(post));
    });
  };
});
