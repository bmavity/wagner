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

  var component = function() {
    var components = {},
        pubsub = {},
        env = {},
        that;

    env.get = $.get;

    env.pub = function(evt) {
      var dataItems = Array.prototype.slice.call(arguments, 1);
      (pubsub[evt] || []).forEach(function(sub) {
        sub.apply(null, dataItems);
      });
    };

    env.sub = function(evt, fn) {
      pubsub[evt] = pubsub[evt] || [];
      pubsub[evt].push(fn);
    };

    env.saga = function(fn) {
      fn();
    };

    env.publish = window.publish;
    env.subscribe = window.subscribe;

    var createComponent = function(name, factoryFn) {
      var dependencies = parseDependencies(factoryFn),
          executedDependencies = dependencies.map(function(dependency) {
            return $('#' + dependency.replace('$', ''));
          });
      factoryFn.apply(env, executedDependencies);
    };

    that = createComponent;
    return that;
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

    this.component = component();
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
