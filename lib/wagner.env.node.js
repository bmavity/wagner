var path = require('path')
	, wagner = require('./wagner')

wagner.extendModule('nativeMod', function(instance, fn) {
	var nativeMod = fn.caller.arguments[2]
	wagner.extendModule('require', function() {
		return nativeMod.require
	})
	Object.keys(nativeMod).forEach(function(key) {
		console.log(key, nativeMod[key])
		wagner.extendModule(key, function() {
			return nativeMod[key]
		})
	})
	return nativeMod
})

wagner.extendResolve(function(name) {
	var mod = this
		, resolved

console.log('require', mod.require)
	try {
		console.log('resolving installed module: "' + name + '"')
	  resolved = mod.require(name)

	  if(resolved) {
	    console.log('resolved installed module: "' + name + '"')
	    return resolved
	  }
	}
	catch(ex) {
	    console.log('failed to resolve installed module: "' + name + '"')
	}

	try {
	  if(mod) {
			console.log('resolving relative module: "' + name + '"')
	    resolved = mod.require(path.join(path.dirname(mod.filename), name))

	    if(resolved) {
	      console.log('resolved relative module: "' + name + '"')
	      return resolved
	    }
	  }
	}
	catch(ex) {
    console.log('failed to resolve relative module: "' + name + '"')
	}
})
