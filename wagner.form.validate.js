var util = require('util')
	, events = require('eventemitter2')
	, async = require('async')
	, moment = require('moment')

function getRegexHandler(regex) {
	return function(potentialVal, cb) {
		var isValid = regex.test(potentialVal)
		deferredResult(isValid, cb)
	}
}

var whitespaceOnly = /^\s*$/
	, deferredResult = function(isValid, cb) {
			process.nextTick(function() {
				cb(null, {
					isValid: isValid
				})
			})
		}

var typeValidators = {
		  uuid: getRegexHandler(/^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/)
		, date: function(potentialDate, cb) {
				var parsedDate = moment(potentialDate, ['YYYY-MM-DD', 'MM-DD-YYYY'])
					, isValid = parsedDate && parsedDate.isValid()
				deferredResult(isValid, cb)
			}
		, string: function(potentialString, cb) {
				var isValid = Object.prototype.toString.call(potentialString) === '[object String]'
				deferredResult(isValid, cb)
			}
		}
typeValidators.guid = typeValidators.uuid

function getValue(form, name) {
	var ele = form.querySelector('[name="' + name + '"]')
	if(!ele) return null
	return ele.value

	var type = ele.nodeName.toLower()
	if(type === 'input') {
		return ele.value
	}
	if(type === 'select') {
		return ele
	}
}

function hasValue(val, cb) {
	var isValid = true
	if(val === null || val === undefined) isValid = false
	if(whitespaceOnly.test(val)) isValid = false
	if(cb) return cb(null, { isValid: isValid })
	return isValid
}

function shouldValidate(schemaEntry, val) {
	var isRequired = !schemaEntry.optional || schemaEntry.required
	if(isRequired) return true
	if(!isRequired && hasValue(val)) return true
}

function FieldValidationResponse(form, schema) {
	var me = this

	function init() {
		me.emit('validating')

		var result = {
					isValid: true
				, fields: {}
				, data: {}
				}
			, fieldValidators = Object.keys(schema).map(function(name) {
					var entry = schema[name]
						, val = getValue(form, name)
					return {
						  fn: typeValidators[entry.type] || hasValue
						, name: name
						, shouldValidate: shouldValidate(entry, val)
						, val: val
					}
				})

		function emitResult(err) {
			if(err || !result.isValid) {
				me.emit('invalidated', result)
			} else {
				me.emit('validated', result.data)
			}
		}

		function performFieldValidation(fieldValidator, cb) {
			if(!fieldValidator.shouldValidate) return cb(null)
			fieldValidator.fn(fieldValidator.val, function(err, res) {
				processFieldValidationResult(fieldValidator, res)
				cb(err)
			})
		}

		function processFieldValidationResult(fieldValidator, res) {
			var name = fieldValidator.name
				, val = fieldValidator.val
			if(res.isValid) {
				result.data[name] = val
			} else {
				result.isValid = false
				result.fields[name] = {
					val: val
				}
			}
		}

		async.each(fieldValidators, performFieldValidation, emitResult)
	}

	events.EventEmitter2.call(this)

	process.nextTick(init)
}
util.inherits(FieldValidationResponse, events.EventEmitter2)


module.exports = function() {
	var component = this

	component.validate = function() {
		return new FieldValidationResponse(component._root, component._schema)
	}

	return component
}
