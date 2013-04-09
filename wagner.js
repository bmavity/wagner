var events = require('eventemitter2')
	, util = require('util')

function extend(mixin) {
	mixin.call(Component.prototype)
}

function Component(rootId) {
	if(!(this instanceof Component)) {
		return new Component(rootId)
	}

	Object.defineProperty(this, '_root', {
		value: $(document.getElementById(rootId))
	})

	Object.defineProperty(this, '_$root', {
		value: $(document.getElementById(rootId))
	})

	events.EventEmitter2.call(this, {
		wildcard: true
	})
}
Component.extend = extend

util.inherits(Component, events.EventEmitter2)
module.exports = Component


Component.evt = require('./wagner.eventDelegation')
Component.formSubmitter = require('./wagner.form.submit')
Component.fsm = require('./wagner.fsm')
Component.ko = require('./wagner.ko')
Component.pubsub = require('./wagner.pubsub')
