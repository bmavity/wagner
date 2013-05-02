
module.exports = function(opts) {
	var form = this._root
		, $submit = this._$root.find('[type="submit"], .submit')
		, component = this
	opts = opts || {}

	function disableSubmit() {
    $submit.addClass('disabled')
    $submit.attr('disabled', true)
	}

	function enableSubmit() {
    $submit.removeClass('disabled')
    $submit.attr('disabled', false)
	}

	component.state('wagner.form.default', {
	  _onEnter: function() {
	  	if(!opts.stopFormReset) {
		  	form.reset()
	  	}
	  	enableSubmit()
	  }
	, 'submitting': 'wagner.form.submitting'
	})

	component.state('wagner.form.validating', {
	  'validated': 'wagner.form.submitting'
	, 'invalidated': 'wagner.form.invalid'
	})

	component.state('wagner.form.invalid', {
	  _onEnter: enableSubmit
	, 'submitting': 'wagner.form.submitting'
	})

	component.state('wagner.form.submitting', {
	  _onEnter: disableSubmit
	, 'validating': 'wagner.form.validating'
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
