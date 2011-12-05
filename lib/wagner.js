;(function(operatic) {
  var functionRegEx = /\(([\s\S]*?)\)/
    , FunctionChainer = operatic.chain.FunctionChainer
    , resolveChain = new FunctionChainer()
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
    var out = {};
    resolveChain.executeChain('resolving module', name, out);
    return out.module;
  };
  /*
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
  */

  var component = (function() {
    var components = {}
      , environments = {}
      , that = new FunctionChainer()
      ;
    var getComponentName = function(fullComponentName) {
      return fullComponentName.split('.')[0];
    };

    var getEnvironment = function(fullComponentName) {
      var componentName = getComponentName(fullComponentName);
      if(!environments[componentName]) {
        environments[componentName] = { name: fullComponentName };
      }
      return environments[componentName];
    };

    var addInitializer = function(module) {
      module.component = function(name, factoryFn) {
        var dependencies = parseDependencies(factoryFn)
          , env = getEnvironment(name)
          , executedDependencies = dependencies.map(resolve)
          ;
        that.executeChain('creating environment', { }, env, function() {
          factoryFn.apply(env, executedDependencies);
        });
        components[name] = module;
      };
    };

    resolveChain.addToChain('resolving module', 'component', function(moduleName, out, next) {
      var potentialModule = components[moduleName];
      if(potentialModule) {
        out.module = potentialModule.exports
      } else if(moduleName === 'component') {
        out.module = that;
      } else {
        next();
      }
    });


    that.addInitializer = addInitializer;
    return that;
  })();

  var define = (function() {
    var modules = {}
      , that = {}
      ;

    var addInitializer = function(module) {
      module.define = function(name, factoryFn) {
        var dependencies = parseDependencies(factoryFn);
        factoryFn.apply({}, dependencies.map(resolve));
        modules[name] = module;
      };
    };

    resolveChain.addToChain('resolving module', 'define', function(moduleName, out, next) {
      var potentialModule = modules[moduleName];
      if(potentialModule) {
        out.module = potentialModule.exports
      } else {
        next();
      }
    });

    that.addInitializer = addInitializer;
    return that;
  })();

  function Module() {
    var exports = {};

    component.addInitializer(this);
    define.addInitializer(this);

    this.exports = exports;
  };


  resolveChain.addToChain('resolving module', 'operatic', function(moduleName, out, next) {
    var potentialModule = operatic[moduleName];
    if(potentialModule) {
      out.module = potentialModule
    } else {
      next();
    }
  });


  window.wagner = {
    Module: Module
  };
})(window.operatic);
