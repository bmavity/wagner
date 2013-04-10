
module.exports = function(formEle, submitEle) {
	var form = formEle || this._root
		, $submit = submitEle || this._$root.find('[type="submit"], .submit')
		, component = this

	function disableSubmit() {
    $submit.addClass('disabled')
    $submit.attr('disabled', true)
	}

	function enableSubmit() {
    $submit.removeClass('disabled')
    $submit.attr('disabled', false)
	}

	component.state( 'wagner.form.default', {
	  _onEnter: function() {
	  	form.reset()
	  	enableSubmit()
	  }
	, 'validating': 'validating'
	, 'submitting': 'submitting'
	})

	component.state('wagner.form.validating', {
	  _onEnter: disableSubmit
	, 'submitting': 'submitting'
	, 'invalid': 'invalid'
	})

	component.state('wagner.form.invalid', {
	  _onEnter: enableSubmit
	, 'validating': 'validating'
	})

	component.state('wagner.form.submitting', {
	  _onEnter: disableSubmit
	, 'submitted': function(res) {
			res.on('data', function(data) {
				component.emit('submission data', data)
			})

			res.on('end', function(result) {
				component.emit('submission result', result)
			  component.transition('wagner.form.default')
			})

			res.on('error', function() {
				component.emit('submission error')
			  component.transition('wagner.form.default')
			})
		}
	})
}
