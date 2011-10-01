var wagner = (function() {
  var functionRegEx = /\(([\s\S]*?)\)/,
      modules = {};

  var parseDependencies = function(fn) {
    return functionRegEx.
      exec(fn)[1].
      replace(/\s/g, '').
      split(',').
      filter(function(name) {
        return name.length !== 0;
      });
  };

  var resolve = function(moduleName) {
    return (modules[moduleName] && modules[moduleName].exports) || window[moduleName];
  };

  var component = (function() {
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
  })();
  window.component = component;

  function Module() {
    var exports = {},
        self = this;

    var define = function(name, dependenciesOrFactory, factoryFn) {
      var factory = factoryFn || dependenciesOrFactory,
          dependencies = parseDependencies(factory);
      factory.apply({}, dependencies.map(function(dependency) {
        return resolve(dependency);
      }));
      modules[name] = self;
    };

    this.component = component.getCreateFn();
    this.define = define;
    this.exports = exports;
  };

  return {
    get: function(name) {
      return modules[name].exports;
    },
    Module: Module
  };
})();
