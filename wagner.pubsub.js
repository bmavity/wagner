var Emitter = require('eventemitter2').EventEmitter2
	, emitter = new Emitter({
			wildcard: true
		})

function pub() {
	var args = [].slice.call(arguments, 0)
	emitter.emit.apply(emitter, args)
}

function sub() {
	var args = [].slice.call(arguments, 0)
	emitter.on.apply(emitter, args)
}

module.exports = function() {
	this.pub = pub
	this.sub = sub
	return this
}
