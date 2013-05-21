var http = require('./wagner.http')

module.exports = function(options) {
	options = options || {}

	if(options.ignoreDefaultFormSubmit) return

	var component = this
		, $form = component._$root
		, method = $form.attr('method').toLowerCase()
		, action = $form.attr('action')

	function processFormResponse(res) {
		res.on('data', function(data) {
			component.emit('submission data', data)
		})

		res.on('end', function(result) {
			component.emit('submission result', result)
		})

		res.on('error', function() {
			component.emit('submission error')
		})

		component.emit('submitted')
	}

	function submitForm(data) {
		http[method](action, data, processFormResponse)
	}

	$form.submit(function(evt) {
		evt.preventDefault()
	  if($form.hasClass('submitting') || $form.hasClass('submitted')) return

	  component.emit('submitting')
	})

	component.on('validated', submitForm)
}
