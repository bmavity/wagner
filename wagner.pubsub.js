var Emitter = require('events').EventEmitter
	, emitter = new Emitter()

function emit() {
	var args = [].slice.call(arguments, 0)
	emitter.emit.apply(emitter, args)
}

function on() {
	var args = [].slice.call(arguments, 0)
	emitter.on.apply(emitter, args)
}

function once() {
	var args = [].slice.call(arguments, 0)
	emitter.once.apply(emitter, args)
}

module.exports = function($form) {
	this.emit = emit
	this.on = on
	this.once = once
	return this
}
