var util = require('util')
	, events = require('eventemitter2')
	, objectize = require('./objectizeForm')
	, async = require('async')
	, moment = require('moment')
	, sarastro = require('sarastro')

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
		, array: function(potentialArray, cb) {
				var isArray = Object.prototype.toString.call(potentialArray) === '[object Array]'
					, isValid = isArray && !!potentialArray.length
				deferredResult(isValid, cb)	
			}
		, date: function(potentialDate, cb) {
				var parsedDate = moment(potentialDate, ['YYYY-MM-DD', 'MM-DD-YYYY'])
					, isValid = parsedDate && parsedDate.isValid()
				deferredResult(isValid, cb)
			}
		, string: function(potentialString, cb) {
				var isString = Object.prototype.toString.call(potentialString) === '[object String]'
				isValid = isString && !whitespaceOnly.test(potentialString)
				deferredResult(isValid, cb)
			}
		}
typeValidators.guid = typeValidators.uuid

function isChecked(ele) {
	return ele.checked
}

function resolveVal(ele) {
	return ele.value
}

function toArray(arrayLike) {
	return [].slice.call(arrayLike, 0)
}

function getValue(form, name) {
	var nameSelector = '[name="' + name + '"]'
		, checks = form.querySelectorAll('[type="checkbox"]' + nameSelector)
	if(checks.length) {
		return toArray(checks).filter(isChecked).map(resolveVal)
	}
		
	var radios = form.querySelectorAll('[type="radio"]' + nameSelector)
	if(radios.length) {
		return resolveVal(toArray(radios).filter(isChecked)[0])
	}

	var single = form.querySelector(nameSelector)
	if(single) {
		return resolveVal(single)
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

function NulloValidationResponse(form) {
	var me = this
	process.nextTick(function() {
		me.emit('validated', objectize(form))
	})
	events.EventEmitter2.call(me)
}
util.inherits(NulloValidationResponse, events.EventEmitter2)


function FieldValidationResponse(form, schema, messageValidator) {
	var me = this
		, validatorArgs
	if(messageValidator) {
		validatorArgs = sarastro(messageValidator)
		validatorArgs.pop()
	}

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
			me.removeAllListeners()
		}

		function getResultDataValue(name) {
			return result.data[name]
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

		function performMessageValidation(err) {
			if(err) return emitResult(err)
			if(!messageValidator) return emitResult()

			var messageData = result.data
				, argVals = validatorArgs.map(getResultDataValue)
			argVals.push(function(err2, res) {
				if(err2) return emitResult(err2)
				if(!res.isValid) {
					result.isValid = false
					result.messageValidationFailed = true
				}
				emitResult()
			})
			messageValidator.apply({}, argVals)
		}

		async.each(fieldValidators, performFieldValidation, performMessageValidation)
	}

	events.EventEmitter2.call(this)

	process.nextTick(init)
}
util.inherits(FieldValidationResponse, events.EventEmitter2)


module.exports = function(options) {
	options = options || {}

	var component = this
		, form = component._root
		, schema = options.schema
		, validate = options.validate
		, ValidationResponse = !!schema ? FieldValidationResponse : NulloValidationResponse

	function validateComponent() {
		var validator = new ValidationResponse(form, schema, validate)

		validator.once('validating', function() {
			component.emit('validating')
		})

		validator.once('validated', function(data) {
			component.emit('validated', data)
		})

		validator.once('invalidated', function(result) {
			component.emit('invalidated', result)
		})
	}

	component.on('submitting', validateComponent)
}
module.exports.FieldValidationResponse = FieldValidationResponse
