var path = require('path')
	, wagner = require('./wagner')
	, winston = require('winston')

winston = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({ level: 'error' })
	]
})

wagner.extendModule('nativeMod', function(instance, fn) {
	var nativeMod = fn.caller.arguments[2]
	wagner.extendModule('require', function() {
		return nativeMod.require
	})
	Object.keys(nativeMod).forEach(function(key) {
		wagner.extendModule(key, function() {
			return nativeMod[key]
		})
	})
	return nativeMod
})

wagner.extendResolve(function(name) {
	var mod = this
		, resolved

	try {
		winston.debug('resolving installed module: "' + name + '"')
	  resolved = mod.require(name)

	  if(resolved) {
	    winston.debug('resolved installed module: "' + name + '"')
	    return resolved
	  }
	}
	catch(ex) {
	    winston.debug('failed to resolve installed module: "' + name + '"')
	    winston.debug(ex)
	}

	try {
	  if(mod) {
			winston.debug('resolving relative module: "' + name + '"')
	    resolved = mod.require(path.join(path.dirname(mod.filename), name))

	    if(resolved) {
	      winston.debug('resolved relative module: "' + name + '"')
	      return resolved
	    }
	  }
	}
	catch(ex) {
    winston.debug('failed to resolve relative module: "' + name + '"')
    winston.debug(ex)	
	}
})

wagner.extendResolve(function(name) {
	if(name === '_') return this.require('underscore')
})
