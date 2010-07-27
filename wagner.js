var compose = (function($, map) {
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
	
	var createComposer = function() {
		var registeredItems = [],
			resolvers = [],
			that = {};
		
		var resolve = function(componentName) {
			for(var i = 0; i < resolvers.length; i++) {
				if(resolvers[i].canResolve(componentName)) {
					return resolvers[i].resolve(componentName);
				}
			}
		};
		that.resolve = resolve;
		
		that.register = function(componentName, creationFunction) {
			registeredItems[componentName] = creationFunction;
			componentConfig.addComponent(componentName, creationFunction);
		};
		
		var addResolver = function(resolver) {
			resolvers.push(resolver);
		};
		that.addResolver = addResolver;
		
		addResolver({
		    canResolve: function(parameterName) {
			    return parameterName.indexOf('DomElement') !== -1;
		    },
		    resolve: function(parameterName) {
			    return document.getElementById(parameterName.replace(' ', ''));
			}
	    });
		
	    addResolver({
		    canResolve: function(parameterName) {
			    return parameterName.indexOf('$') === 0;
		    },
		    resolve: function(parameterName) {
			    return $('#' +  parameterName.replace('$', ''));
		    }
	    });
		
		addResolver((function() {
			var resolvedItems = {},
				that = {};
				
			var createItem = function(parameterName) {
				var creationFunction = registeredItems[parameterName],
					resolvedItem = {};
				creationFunction.apply(resolvedItem, map(componentConfig.getDependencies(parameterName), resolve));
				resolvedItems[parameterName] = resolvedItem;
			};
			
			that.canResolve = function(parameterName) {
				return true;
			};
			
			that.resolve = function(parameterName) {
				if(!resolvedItems[parameterName]) {
					createItem(parameterName);
				}
				return resolvedItems[parameterName];
			};;
			
			return that;
		})());
		
		return that;
	};
	
	var innerIoc = createComposer();
	
	return function(item, creationFunction) {
		if(typeof(creationFunction) !== 'undefined') {
			innerIoc.register(item, creationFunction);
		} else {
			return innerIoc.resolve(item);
		}
	};
})(jQuery, function(sequence, fn, object) {
    var len = sequence.length,
        result = new Array(len);
    for (var i = 0; i < len; i++) {
        result[i] = fn.apply(object, [sequence[i], i]);
	}
    return result;
});