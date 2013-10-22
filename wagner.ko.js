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

function knockoutDataBinder(options) {
	var handlers = {}
		, root = this._root
		, viewModel
		, wasApplied
	options = options || {}

	function ensureBindings() {
		if(wasApplied) return
		ko.applyBindings(viewModel, root)
		wasApplied = true
	}
	
	function createViewModel(obj) {
		if(options.bindMapping) {
			viewModel = mapping.fromJS(obj, options.bindMapping)
		} else {
			viewModel = mapping.fromJS(obj)
		}
	}

	function ensureViewModel(schema) {
		if(!viewModel) {
			if(options.bindWith) {
				createViewModel(options.bindWith)
			} else {
				createViewModel(schema)
			}
		}
	}

	function update(values) {
		ensureViewModel(values)
		mapping.fromJS(values, viewModel)
		ensureBindings()
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


module.exports = knockoutDataBinder
module.exports.ko = ko
module.exports.mapping = mapping
