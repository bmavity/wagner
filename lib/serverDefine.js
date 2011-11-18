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
  var module;
  try {
    module = modules[name].exports || require(name);
    if(!module) {
      throw 'No module named "' + name + '" has been registered or is available globally.';
    }
  }
  catch(ex) {
    console.log(ex);
  }
  return module;
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
    var define = function(name, factoryFn) {
      modules[name] = module;
      factoryFn.apply({}, parseDependencies(factoryFn).map(resolve));
      delete global.define;
    };

    global.define = define;
  }
);
