var Emitter = require('events').EventEmitter
	, emitter = new Emitter()

function pub() {
	var args = [].slice.call(arguments, 0)
	emitter.emit.apply(emitter, args)
}

function sub() {
	var args = [].slice.call(arguments, 0)
	emitter.on.apply(emitter, args)
}

function once() {
	var args = [].slice.call(arguments, 0)
	emitter.once.apply(emitter, args)
}

module.exports = function($form) {
	this.pub = pub
	this.sub = sub
	this.once = once
	return this
}
