var events = require('events')
	, util = require('util')

function extend(mixin) {
	mixin.call(Component.prototype)
}

function Component(root) {
	this._root = root
	/*
	Object.defineProperty(this, '_root', {
		value: root
	})
*/
	events.EventEmitter.call(this)

	this.emit('init', this._root)
}
Component.extend = extend

util.inherits(Component, events.EventEmitter)
module.exports = function(id) {
	var root = document.getElementById(id)
	return new Component(root)
}


extend(require('./wagner.form.serialize'))
extend(require('./wagner.form.submit'))
extend(require('./wagner.fsm'))
