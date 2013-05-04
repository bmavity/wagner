var events = require('eventemitter2')
	, util = require('util')
	, path = require('path')
	, mixins = []

var evt = require('./wagner.eventDelegation')
	, formFsm = require('./wagner.form.fsm')
	, validate = require('./wagner.form.validate')
	, formSubmitter = require('./wagner.form.submit')
	, fsm = require('./wagner.fsm')
	, ko = require('./wagner.ko')

var all = []
	, whenForm = [
			formSubmitter
		, validate
		, formFsm
		]

function extend(mixin) {
	all.push(mixin)
}

function extendWhenForm(mixin) {
	whenForm.push(mixin)
}

function Component(rootPath, options) {
	if(!(this instanceof Component)) {
		return new Component(rootPath, options)
	}

	var rootId = path.basename(rootPath, path.extname(rootPath))
		, root = document.getElementById(rootId)
		, component = this
	options = options || {}

	function addBehavior(mixin) {
		mixin.call(component, options)
	}

	Object.defineProperty(this, '_root', {
		value: root
	})

	Object.defineProperty(this, '_$root', {
		value: $(root)
	})

	events.EventEmitter2.call(component, {
		wildcard: true
	})

	all.forEach(addBehavior)
	if(root.nodeName.toLowerCase() === 'form') {
		whenForm.forEach(addBehavior)
	}

	if(options.allowBinding || options.bindWith) {
		ko.call(component, options)
	}
}
util.inherits(Component, events.EventEmitter2)


module.exports = Component
module.exports.extend = extend
module.exports.extendWhenForm = extendWhenForm
module.exports.evt = evt
module.exports.formSubmitter = formSubmitter
module.exports.fsm = fsm
module.exports.ko = ko
