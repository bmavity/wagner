var events = require('events')
	, util = require('util')

function extend(mixin) {
	mixin.call(Component.prototype)
}

function Component(rootId) {
	if(!(this instanceof Component)) {
		return new Component(rootId)
	}

	this._root = $(document.getElementById(rootId))
	/*
	Object.defineProperty(this, '_root', {
		value: root
	})
*/
	events.EventEmitter.call(this)
}
Component.extend = extend

util.inherits(Component, events.EventEmitter)
module.exports = Component
/*
function(id) {
	var root = document.getElementById(id)
	return new Component(root)
}
*/


Component.formSubmitter = require('./wagner.form.submit')
Component.fsm = require('./wagner.fsm')
Component.pubsub = require('./wagner.pubsub')
