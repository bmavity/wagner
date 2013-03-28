var url = require('url')
	, http = require('http')
	, events = require('events')
	, util = require('util')
	, formSerializer = require('./wagner.form.serialize')
	, submitters = {
			get: get
		, post: post
		}

function get(path, data, cb) {
	var pathUrl = url.parse(path)
	if(cb) {
		pathUrl.query = data
	}
	var opts = {
				method: 'get'
			, path: url.format(pathUrl)
			}
		, req = http.request(opts, cb)
	req.setHeader('accept', 'application/json')
	req.end()
}

function post(path, data, cb) {
	var pathUrl = url.parse(path)
		, opts = {
				method: 'post'
			, path: url.format(pathUrl)
			}
		, req = http.request(opts, cb)
	req.setHeader('Content-Type', 'application/json')
	req.setHeader('accept', 'application/json')
	if(cb) {
		req.write(JSON.stringify(data))
	}
	req.end()
}

function FormSubmissionResponse(component, res) {
	var self = this

	res.on('ready', function() {
		console.log('ready')
	})

	res.on('data', function(data) {
		self.emit('data', data)
	})

	res.on('error', function() {
		console.log('error')
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

	events.EventEmitter.call(this)
}
util.inherits(FormSubmissionResponse, events.EventEmitter)


function submitForm($form) {
	var method = $form.attr('method').toLowerCase()
		, action = $form.attr('action')
		, self = this
		, data = self.objectizeForm($form)
	submitters[method](action, data, function(res) {
		self.emit('submitted', new FormSubmissionResponse(self, res))
	})
}

module.exports = function($root) {
	var self = this
	formSerializer.call(self, $root)
	$root.submit(function(evt) {
		evt.preventDefault()
		self.emit('submitting')
		submitForm.call(self, $(evt.target).closest('form'))
	})
	return this
}