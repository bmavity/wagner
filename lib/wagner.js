;(function(env) {
  var exports = env.exports
    , functionRegEx = /\(([\s\S]*?)\)/
    , moduleExtensions = {}
    , resolverExtensions = []
    , modules = {}

  var extendModule = function(name, fn) {
    moduleExtensions[name] = fn
  }

  var extendResolve = function(resolver) {
    resolverExtensions.push(resolver)
  }

  var parseDependencies = function(fn) {
    return functionRegEx.
      exec(fn)[1].
      replace(/\s/g, '').
      split(',').
      filter(function(name) {
        return name.length !== 0
      })
  }

  var resolve = function(name) {
    var mod = this
      , resolved

    resolverExtensions.some(function(resolver) {
      resolved = resolver.apply(mod, [ name ])
      return !!resolved
    })

    if(resolved) {
      return resolved.exports || resolved
    }

    return modules[name]
  }

  function Module() {
    var self = this

    this.resolve = function(name) {
      return resolve.apply(self, [ name ])
    }

    Object.keys(moduleExtensions).forEach(function(name) {
      self[name] = moduleExtensions[name](self, Module)
    })
  }


  exports.extendModule = extendModule
  exports.extendResolve = extendResolve
  exports.Module = Module
  exports.resolve = resolve
  exports.parseDependencies = parseDependencies


  modules.wagner = exports
  env.global.Module = Module
})(typeof window === 'undefined' ? { global: global, exports: exports } : { global: window, exports: {} })