var path = require('path')
	, wagner = require('./wagner')

wagner.extendModule('filename', function(instance, fn) {
	var filepath = fn.caller.arguments[2].filename
	return path.basename(filepath, path.extname(filepath))
})

wagner.extendModule('dirname', function(instance, fn) {
	return path.dirname(fn.caller.arguments[2].filename)
})

wagner.extendModule('exports', function(instance, fn) {
	return fn.caller.arguments[2].exports
})

wagner.extendResolve(function(name) {
	var mod = this
		, resolved

	try {
	  resolved = require(name)

	  if(resolved) {
	    console.log('resolved require', name)
	    return resolved
	  }
	}
	catch(ex) {

	}

	try {
		console.log(name, mod)
	  if(mod) {
	    resolved = require(path.join(mod.dirname, name))

	    if(resolved) {
	      console.log('resolved relative require', name)
	      return resolved
	    }
	  }
	}
	catch(ex) {
		console.log(ex)
	}
})
