var dom = require('jsdom');

dom.env('<p><a class="the-link" href="http://www.google.com">Google</a><input class="name" type="text" /></p>', [
  'http://code.jquery.com/jquery-1.5.min.js',
  'jquery.caruso.text.js',
  'jquery.caruso.injector.js'
], function(errors, window) {
  window.$('p').inject({ name: 'bill' });
  console.log('contents of a.the-link:', window.$('a.the-link').text());
  console.log('contents of input', window.$('input').val());
  console.log(window.document.innerHTML);
});
