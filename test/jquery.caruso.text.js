(function($) {
  $.pascalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  $.camelize = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };
})(jQuery);
