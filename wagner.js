var events = require('events')
	, util = require('util')

function Component(root) {
	Object.defineProperty(this, 'root', {
		value: root
	})
	events.EventEmitter.call(this)
}
util.inherits(Component, events.EventEmitter)
module.exports = Component
