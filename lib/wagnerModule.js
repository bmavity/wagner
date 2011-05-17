(function() {
  var define = define || node.Module.define,
      module = {},
      module.exports = {};

  define('', function(test) {

    
    module.exports.sayHi = function() {
      test.log('hi');
    };
  });
  
  //module = define('???');
})();
