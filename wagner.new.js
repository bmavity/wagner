;(function() {
  var functionRegEx = /\(([\s\S]*?)\)/
    , modules = {}
    , envs = {}
    , creatingEnvHandlers = []
    , wagner = {}
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

  var resolve = function(moduleName) {
    if(moduleName.indexOf('$') === 0) {
      var $ele = $('#' + moduleName.replace('$', ''));
      if($ele.length) return $ele;
    }
    if(modules[moduleName]) return modules[moduleName].exports;
    return window[moduleName];
  };

  function Module() {
    var exports = {}
      , self = this
      ;
    var component = function(name, factoryFn) {
      var dependencies = parseDependencies(factoryFn)
        , nameParts = name.split('.')
        , componentName = nameParts[0]
        , env
        ;
      if(nameParts.length === 1) {
        env = {};
        creatingEnvHandlers.forEach(function(handler) {
          handler(env);
        });
        envs[componentName] = env;
      }
      factoryFn.apply(envs[componentName], dependencies.map(function(dependency) {
        return resolve(dependency);
      }));
      modules[name] = self;
    };

    var define = function(name, factoryFn) {
      var dependencies = parseDependencies(factoryFn);
      factoryFn.apply({}, dependencies.map(function(dependency) {
        return resolve(dependency);
      }));
      modules[name] = self;
    };


    this.component = component;
    this.define = define;
    this.exports = exports;
  };

  var onCreatingEnv = function(handler) {
    creatingEnvHandlers.push(handler);
  };


  wagner.Module = Module;
  wagner.onCreatingEnv = onCreatingEnv;

  window.Module = Module;
})();
