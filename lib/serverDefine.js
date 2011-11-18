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

var toArray = function(arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
};

var callBefore = function(obj, fnName, callBeforeFn) {
  var old = obj[fnName];
  obj[fnName] = function() {
    var argsArr = toArray(arguments);
    callBeforeFn.apply({}, argsArr);
    old.apply(obj, argsArr);
  };
};

callBefore(
  require.extensions
, '.js'
, function(module, filename) {
    var resolve = function(name) {
      var resolvedModule;
      try {
        resolvedModule = (modules[name] && modules[name].exports) || module.require(name);
      }
      catch(ex) {
        console.log(ex);
      }
      return resolvedModule;
    };

    var define = function(name, factoryFn) {
      modules[name] = module;
      factoryFn.apply({}, parseDependencies(factoryFn).map(resolve));
      delete global.define;
    };

    global.define = define;
  }
);
