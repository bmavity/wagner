var ko = require('knockout')
	, mapping = require('./ko-mapping')

function knockoutDataBinder(options) {
	var handlers = {}
		, root = this._root
		, viewModel
	options = options || {}
	
	function createViewModel(obj) {
		if(options.bindMapping) {
			viewModel = mapping.fromJS(obj, options.bindMapping)
		} else {
			viewModel = mapping.fromJS(obj)
		}
		ko.applyBindings(viewModel, root)
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