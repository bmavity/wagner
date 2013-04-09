var ko = require('knockout')
	, _ = require('underscore')

function knockoutDataBinder(schema, ele) {
	var handlers = {}
		, root = ele || this._$root[0]
		, viewModel = schema
		, self = this

	function update(values) {
		_.forEach(values, function(val, name) {
			if(viewModel[name]) {
				viewModel[name](val)
			}
		})
	}

	ko.applyBindings(viewModel, root)

	this.update = update
	return this
}

knockoutDataBinder.array = function() {
	return ko.observableArray()
}

knockoutDataBinder.obj = function() {
	return ko.observable()
}


module.exports = knockoutDataBinder