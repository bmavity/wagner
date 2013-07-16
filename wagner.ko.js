var ko = require('knockout')
	, mapping = require('./ko-mapping')

ko.bindingHandlers.state = {
	update: function(ele, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var allBindings = allBindingsAccessor()
			, $ele = $(ele)
		if(allBindingsAccessor.allStates) {
			$ele.removeClass(allBindingsAccessor.allStates.join(' '))
		}
		$ele.addClass(ko.utils.unwrapObservable(valueAccessor()))
	}
}

function oi(obj, cb) {
	Object.keys(obj).forEach(function(key) {
		cb(obj[key], key)
	})
}

function knockoutDataBinder(options) {
	var handlers = {}
		, root = this._root
		, viewModel
	options = options || {}
	
	function createViewModel(obj) {
		viewModel = mapping.fromJS(obj)
		if(options.bindMapping) {
			viewModel = mapping.fromJS(obj, options.bindMapping, viewModel)
		}
		ko.applyBindings(viewModel, root)
		if(options.notifyOn) {
			oi(options.notifyOn, function(fn, key) {
				viewModel[key].subscribe(fn)
			})
		}
	}

	function ensureViewModel(schema) {
		if(!viewModel) {
			createViewModel(schema)
		}
	}

	function update(values) {
		ensureViewModel(values)
		mapping.fromJS(values, viewModel)
	}

	if(options.bindWith) {
		createViewModel(options.bindWith)
	}

	this.update = update
	return this
}

knockoutDataBinder.arr = function() {
	return ko.observableArray()
}

knockoutDataBinder.obj = function(val) {
	return ko.observable(val)
}

knockoutDataBinder.mapping = mapping


module.exports = knockoutDataBinder