var url = require('url')
	, http = require('http')

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


module.exports = {
	get: get
, post: post
}