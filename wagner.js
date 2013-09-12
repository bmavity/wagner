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
		, $root = $(root)
		, component = this
	options = options || {}

	component._name = rootId
	component._root = root
	component._$root = $root

	function addBehavior(mixin) {
		mixin.call(component, options)
	}

	events.EventEmitter2.call(component, {
		wildcard: true
	})

	component.addBehavior = addBehavior

	all.forEach(addBehavior)
	if(root.nodeName.toLowerCase() === 'form') {
		whenForm.forEach(addBehavior)
	}

	if(options.allowBinding || options.bindWith) {
		ko.call(component, options)
	}
}
util.inherits(Component, events.EventEmitter2)

Component.prototype.getVal = function(name) {
	var $ele = this._$root.find('[name="' + name + '"]')	
		, $checked
	if($ele.length > 1) {
		$checked = $ele.filter(':checked')
		if($checked.length === 1 && !$checked.is('[type="checkbox"]')) {
			return $checked.val()
		}
		return $checked.map(function() {
			return $(this).val()
		}).get()
	}
	return $ele.val()
}


module.exports = Component
module.exports.extend = extend
module.exports.extendWhenForm = extendWhenForm
module.exports.evt = evt
module.exports.formSubmitter = formSubmitter
module.exports.fsm = fsm
module.exports.ko = ko
module.exports.http = require('./wagner.http')
module.exports.validate = validate
