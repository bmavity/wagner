var url = require('url')
	, util = require('util')
	, events = require('eventemitter2')
	, http = require('http')
	, bus 

function HttpFormSubmissionResponse(res, url) {
	var me = this
		, resData = ''

	me.url = url

	if(res.statusCode === 401 && bus) {
		bus.pub('unauthenticated ajax request')
	}

	res.on('data', function(data) {
		resData += data
		me.emit('data', data)
	})

	res.on('error', function(err) {
		console.log('in wagner: ', err)
		me.emit('error')
	})
	
	res.on('end', function() {
		me.emit('end', resData && JSON.parse(resData))
	})

	events.EventEmitter2.call(me)
}
util.inherits(HttpFormSubmissionResponse, events.EventEmitter2)

function performCallback(url, cb) {
	return function(res) {
		cb(new HttpFormSubmissionResponse(res, url))
	}
}

function getUrl(path, data) {
	var pathUrl = url.parse(path)
	pathUrl.query = data
	return url.format(pathUrl)
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
		, req = http.request(opts, performCallback(opts.path, cb))
	req.setHeader('accept', 'application/json')
	req.end()
}

function post(path, data, cb) {
	var pathUrl = url.parse(path)
		, opts = {
				method: 'post'
			, path: url.format(pathUrl)
			}
		, req = http.request(opts, performCallback(opts.path, cb))
	req.setHeader('Content-Type', 'application/json')
	req.setHeader('accept', 'application/json')
	if(cb) {
		req.write(JSON.stringify(data))
	}
	req.end()
}


module.exports = {
	get: get
, getUrl: getUrl
, post: post
}
module.exports.setBus = function(aBus) {
	bus = aBus
}