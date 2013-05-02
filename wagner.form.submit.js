var events = require('eventemitter2')
	, util = require('util')
	, objectize = require('./objectizeForm')
	, http = require('./wagner.http')

function NulloValidationResponse() {
	if(!(this instanceof NulloValidationResponse)) {
		return new NulloValidationResponse()
	}

	var me = this
	process.nextTick(function() {
		me.emit('validated')
	})
	events.EventEmitter2.call(this)
}
util.inherits(NulloValidationResponse, events.EventEmitter2)

function FormSubmissionResponse(component, res) {
	var self = this
		, resData = ''

	res.on('data', function(data) {
		resData += data
		self.emit('data', data)
	})

	res.on('error', function() {
		self.emit('error')
	})
	
	res.on('end', function() {
		self.emit('end', JSON.parse(resData))
	})

	if(res.statusCode === 401) {
		//self.emit('unauthenticated')
		console.log('unauthenticated')
	}

	events.EventEmitter2.call(this)
}
util.inherits(FormSubmissionResponse, events.EventEmitter2)



module.exports = function(options) {
	var component = this
		, $root = component._$root
	options = options || {}

	component.validate = component.validate || NulloValidationResponse

	function performSubmission($form) {
		function submitForm() {
			var method = $form.attr('method').toLowerCase()
				, action = $form.attr('action')
				, data = objectize($form)
			http[method](action, data, function(res) {
				component.emit('submitted', new FormSubmissionResponse(self, res))
			})
		}

	  component.emit('submitting')

		var validator = component.validate()
		validator.once('validating', function() {
			component.emit('validating')
		})
		validator.once('validated', function() {
			component.emit('validated')
			submitForm()
		})
		validator.once('invalidated', function(result) {
			component.emit('invalidated')
		})
	}

	$root.submit(function(evt) {
	  var $form = $(evt.target).closest('form')
	  if(!$form.length) return

		evt.preventDefault()
	  if($form.hasClass('submitting') || $form.hasClass('submitted')) return
	  performSubmission($form)
	})
	return this
}
