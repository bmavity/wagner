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

function HttpFormSubmissionResponse(formVals) {
	if(!(this instanceof HttpFormSubmissionResponse)) {
		return new HttpFormSubmissionResponse(formVals)
	}

	var me = this

	events.EventEmitter2.call(this)

	http[formVals.method](formVals.action, formVals.data, function(res) {
		var resData = ''

		res.on('data', function(data) {
			resData += data
			me.emit('data', data)
		})

		res.on('error', function() {
			me.emit('error')
		})
		
		res.on('end', function() {
			me.emit('end', resData && JSON.parse(resData))
		})

		if(res.statusCode === 401) {
			//self.emit('unauthenticated')
			console.log('unauthenticated')
		}
	})
}
util.inherits(HttpFormSubmissionResponse, events.EventEmitter2)



module.exports = function(options) {
	var component = this
		, $root = component._$root
	options = options || {}

	component.validate = component.validate || NulloValidationResponse
	component.submissionResponse = component.submissionResponse || HttpFormSubmissionResponse

	function performSubmission($form) {
		function submitForm() {
			var method = $form.attr('method').toLowerCase()
				, action = $form.attr('action')
				, data = objectize($form)
				, res = component.submissionResponse({
					  action: action
					, data: data
					, method: method
					})
			component.emit('submitted', res)
		}

	  component.emit('submitting')

		var validator = component.validate()
		validator.once('validating', function() {
			component.emit('validating')
		})
		validator.once('validated', function(data) {
			component.emit('validated', data)
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
