var Wagner = (function(map) {
	var componentConfig = (function() {
		var functionRegEx = /\(([\s\S]*?)\)/,
			dependencies = {},
			that = {};
		
		var removeSpaces = function(name) {
		    return name.replace(' ', '');
		};
		
		var parseDependencies = function(fn) {
			var dependencyNames = functionRegEx.exec(fn)[1];
			if(!dependencyNames) {
				return [];
			}
			return map(dependencyNames.split(','), removeSpaces);
		};
		
		that.addComponent = function(name, fn) {
			dependencies[name] = parseDependencies(fn);
		};
		
		that.getDependencies = function(name) {
			return dependencies[name];
		};
		
		return that;
	})();
	
	var resolverMania = (function() {
		var resolvers = [],
			resolverCache = {},
			that = {};
		
		var addToCache = function(name) {
			for(var i = 0; i < resolvers.length; i++) {
				if(resolvers[i].canResolve(name)) {
					resolverCache[name] = resolvers[i];
					break;
				}
			}
		};
		
		that.addResolver = function(resolver) {
			resolvers.push(resolver);
		};
		
		that.hasResolver = function(name) {
			if(!resolverCache[name]) {
				addToCache(name);
			}
			return resolverCache[name];
		};
		
		that.resolve = function(name) {
			return resolverCache[name].resolve(name);
		};
		
		return that;
	})();
	
	var composer = (function() {
		var componentCache = {},
			components = [],
			that = {};
		
		var createComponent = function(name) {
			var fn = components[name],
				dependencies = map(componentConfig.getDependencies(name), resolve),
				component = {};
			fn.apply(component, dependencies);
			return component;
		};
		
		that.addComponent = function(name, fn) {
			components[name] = fn;
			componentConfig.addComponent(name, fn);
		};
		
		var resolve = function(name) {
			if(resolverMania.hasResolver(name)) {
				return resolverMania.resolve(name);
			}
			if(!componentCache[name]) {
				componentCache[name] = createComponent(name);
			}
			return componentCache[name];
		};
		that.resolve = resolve;
		
		return that;
	})();

	var compose = function(name, fn) {
		if(typeof(fn) !== 'undefined') {
			composer.addComponent(name, fn);
		} else {
			return composer.resolve(name);
		}
	};

	return {
		addResolver: resolverMania.addResolver,
		compose: compose
	};
})(function(sequence, fn, object) {
	var len = sequence.length,
		result = new Array(len);
	for (var i = 0; i < len; i++) {
		result[i] = fn.apply(object, [sequence[i], i]);
	}
	return result;
});




(function() {
	Wagner.addResolver({
	    canResolve: function(name) {
		    return name.indexOf('DomElement') !== -1;
	    },
	    resolve: function(name) {
		    return document.getElementById(name.replace(' ', ''));
		}
    });
})();


(function($) {
	Wagner.addResolver({
	    canResolve: function(name) {
		    return name.indexOf('$') === 0;
	    },
	    resolve: function(name) {
		    return $('#' +  name.replace('$', ''));
	    }
    });
})(jQuery);