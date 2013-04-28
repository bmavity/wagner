var events = require('eventemitter2')
	, util = require('util')
	, path = require('path')
	, mixins = []

var evt = require('./wagner.eventdelegation')
	, formFsm = require('./wagner.form.fsm')
	, formSubmitter = require('./wagner.form.submit')
	, fsm = require('./wagner.fsm')
	, ko = require('./wagner.ko')
	, pubsub = require('./wagner.pubsub')

function extend(mixin) {
	mixin.call(Component.prototype)
}

function Component(rootPath, options) {
	if(!(this instanceof Component)) {
		return new Component(rootPath, options)
	}

	var rootId = path.basename(rootPath, path.extname(rootPath))
		, root = document.getElementById(rootId)
	options = options || {}

	Object.defineProperty(this, '_root', {
		value: root
	})

	Object.defineProperty(this, '_$root', {
		value: $(root)
	})

	events.EventEmitter2.call(this, {
		wildcard: true
	})

	pubsub.call(this)
	evt.call(this, options)
	fsm.call(this)

	if(root.nodeName.toLowerCase() === 'form') {
		formSubmitter.call(this)
		formFsm.call(this)
	}

	if(options.schema) {
		ko.call(this, options.schema)
	}
}
Component.extend = extend

util.inherits(Component, events.EventEmitter2)
module.exports = Component