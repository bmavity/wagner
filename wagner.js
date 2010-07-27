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
	
	var composer = (function() {
		var registeredItems = [],
			resolvers = [],
			defaultResolver = (function() {
				var resolvedItems = {};

				var createItem = function(parameterName) {
					var creationFunction = registeredItems[parameterName],
						resolvedItem = {};
					creationFunction.apply(resolvedItem, map(componentConfig.getDependencies(parameterName), resolveComponent));
					resolvedItems[parameterName] = resolvedItem;
				};

				var resolve = function(parameterName) {
					if(!resolvedItems[parameterName]) {
						createItem(parameterName);
					}
					return resolvedItems[parameterName];
				};;

				return {
					resolve: resolve
				};
			})();
		
		var addResolver = function(resolver) {
			resolvers.push(resolver);
		};
		
		var register = function(componentName, creationFunction) {
			registeredItems[componentName] = creationFunction;
			componentConfig.addComponent(componentName, creationFunction);
		};

		var resolveComponent = function(componentName) {
			for(var i = 0; i < resolvers.length; i++) {
				if(resolvers[i].canResolve(componentName)) {
					return resolvers[i].resolve(componentName);
				}
			}
			return defaultResolver.resolve(componentName);
		};
		
		return {
			addResolver: addResolver,
			register: register,
			resolve: resolveComponent
		};
	})();

	var compose = (function() {
		return function(item, creationFunction) {
			if(typeof(creationFunction) !== 'undefined') {
				composer.register(item, creationFunction);
			} else {
				return composer.resolve(item);
			}
		};
	})();

	return {
		addResolver: composer.addResolver,
		compose: compose
	}
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
	    canResolve: function(parameterName) {
		    return parameterName.indexOf('DomElement') !== -1;
	    },
	    resolve: function(parameterName) {
		    return document.getElementById(parameterName.replace(' ', ''));
		}
    });
})();


(function($) {
	Wagner.addResolver({
	    canResolve: function(parameterName) {
		    return parameterName.indexOf('$') === 0;
	    },
	    resolve: function(parameterName) {
		    return $('#' +  parameterName.replace('$', ''));
	    }
    });
})(jQuery);