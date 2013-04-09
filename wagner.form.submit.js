var events = require('eventemitter2')
	, util = require('util')
	, formSerializer = require('./wagner.form.serialize')
	, http = require('./wagner.http')

function FormSubmissionResponse(component, res) {
	var self = this

	res.on('ready', function() {
		console.log('ready')
	})

	res.on('data', function(data) {
		self.emit('data', data)
	})

	res.on('error', function() {
		self.emit('error')
	})
	
	res.on('close', function() {
		console.log('close')
	})
	
	res.on('end', function() {
		console.log('end')
	})

	if(res.statusCode === 401) {
		//self.emit('unauthenticated')
		console.log('unauthenticated')
	}

	events.EventEmitter2.call(this)
}
util.inherits(FormSubmissionResponse, events.EventEmitter2)


function submitForm($form) {
	var method = $form.attr('method').toLowerCase()
		, action = $form.attr('action')
		, self = this
		, data = self.objectizeForm($form)
	http[method](action, data, function(res) {
		self.emit('submitted', new FormSubmissionResponse(self, res))
	})
}

function submitHandler($form) {
  var self = this
  self.emit('submitting')
	submitForm.call(self, $form)
}


module.exports = function($root) {
	var self = this
	formSerializer.call(self, $root)
	$root.submit(function(evt) {
		evt.preventDefault()
	  var $form = $(evt.target).closest('form')
	  
	  if($form.hasClass('submitting') || $form.hasClass('submitted')) return
	  
	  submitHandler.call(self, $form)
	})
	return this
}
