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
    return modules[moduleName].exports;
  };

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
