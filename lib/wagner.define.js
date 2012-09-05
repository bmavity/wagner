;(function(module) {
	var wagner = module.resolve('wagner')
		, modules = {}

	var define = function(instance, fn) {
		return function(name, factoryFn) {
			var dependencies 

			if(!factoryFn) {
				factoryFn = name
				name = instance.filename
			}

			dependencies = wagner.parseDependencies(factoryFn)
	    factoryFn.apply({}, dependencies.map(function(dependency) {
	    	return instance.resolve(dependency)
	    }))
	    modules[name] = this
		}
	}

	var resolve = function(name) {
		return modules[name]
	}

	wagner.extendModule('define', define)
	wagner.extendResolve(resolve)
})(new Module)