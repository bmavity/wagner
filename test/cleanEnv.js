var vm = require('vm')
	, fs = require('fs')
	, path = require('path')

var executeFile = function(fileName, cb) {
	var filePath = path.join(__dirname, fileName)
	fs.readFile(filePath, function(err, fileStream) {
		executeScript(fileStream.toString(), filePath, cb)
	})
}

var executeScript = function(script, filePath, cb) {
	var sandbox = {
				require: require
			}
	vm.runInNewContext(script, sandbox, filePath)
	cb(sandbox)
}


exports.executeFile = executeFile
exports.executeScript = executeScript