var ko = require('knockout')
	, _ = require('underscore')

function ViewModelUpdater(viewModel) {
	this._vm = viewModel
}
var vmu = ViewModelUpdater.prototype

vmu.updateValue = function(val, name) {
	if(this._vm[name]) {
		this._vm[name](val)
	}
}

vmu.update = function(val, name) {
	if(_.isArray(val)) {
		var arr = this._vm[name]
		arr.removeAll()
		val.forEach(function(obj) {
			arr.push(obj)
		})
	} else if(_.isObject(val)) {
		_.forEach(val, this.update, this)
	} else {
		this.updateValue(val, name)
	}
}

function transformToViewModel(schema) {
	var vm = {}
	_.forEach(schema, function(val, name) {
		if(_.isFunction(val)) return
		if(_.isArray(val)) {
			vm[name] = ko.observableArray()
		} else if(_.isObject(val)) {
			if(Object.keys(val).length) {
				vm[name] = transformToViewModel(val)
			} else {
				vm[name] = ko.observable()
			}
		} else {
			vm[name] = ko.observable(val)
		}
	})
	return vm
}

function knockoutDataBinder(schema) {
	var handlers = {}
		, root = this._root
		, isBound
		, viewModel
		, updater
	
	function ensureBound(schema) {
		if(!isBound) {
			viewModel = transformToViewModel(schema)
			updater = new ViewModelUpdater(viewModel)
			ko.applyBindings(viewModel, root)
			isBound = true
		}
	}

	function update(values) {
		ensureBound(values)
		updater.update(values)
	}

	if(schema) {
		ensureBound(schema)
	}

	this.update = update
	return this
}

knockoutDataBinder.array = function() {
	return ko.observableArray()
}

knockoutDataBinder.obj = function(val) {
	return ko.observable(val)
}


module.exports = knockoutDataBinder