;(function(global) {
  var functionRegEx = /\(([\s\S]*?)\)/
    , modules = {}
    ;

  var parseDependencies = function(fn) {
    return functionRegEx.
      exec(fn)[1].
      replace(/\s/g, '').
      split(',').
      filter(function(name) {
        return name.length !== 0;
      });
  };

  var resolve = function(name) {
    var module = modules[name] || window[name];
    // This should be in extensibility point (probably all should)
    if(!module && window.$) {
      var $ele = $('#' + name.replace('$', ''));
      if($ele.length) {
        module = $ele;
      }
    }
    if(!module) {
      throw 'No module named "' + name + '" has been registered or is available globally.';
    }
    return module;
  };

  var component = (function() {
    /*
    var components = {},
        that = new chains.FunctionChainer();

    var getCreateFn = function() {
      return function(name, factoryFn) {
        var dependencies = parseDependencies(factoryFn)
          , $ele = $('#' + name)
          , executedDependencies = dependencies.map(function(dependency) {
              return $('#' + dependency.replace('$', ''));
            })
          , env = {}
          ;
        that.executeChain('creating environment', { $ele: $ele }, env, function() {
          factoryFn.apply(env, executedDependencies);
        });
      };
    };

    that.getCreateFn = getCreateFn;
    return that;
    */
  })();

  function Module() {
    var exports = {}
      , self = this
      ;

    var define = function(name, factoryFn) {
      var dependencies = parseDependencies(factoryFn);
      factoryFn.apply({}, dependencies.map(resolve));
      modules[name] = self.exports;
    };

    this.define = define;
    this.exports = exports;

    this.component = {};//component.getCreateFn();
  };

  global.wagner = {
    Module: Module
  };
})(typeof window === 'undefined' ? global : window);
