var events = require('events')
	, util = require('util')

function extend(mixin) {
	mixin.call(Component.prototype)
}

function Component(root) {
	var root = document.getElementById(root)
	/*
	Object.defineProperty(this, '_root', {
		value: root
	})
*/
	events.EventEmitter.call(this)

	this.emit('init', root)
}
Component.extend = extend

util.inherits(Component, events.EventEmitter)
module.exports = function(id) {
	return new Component(id)
}


extend(require('./wagner.form.serialize'))
extend(require('./wagner.form.submit'))
