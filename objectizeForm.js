function objectize(form) {
	$form = $(form)

	var $textEles = $form.find('input:not([type="button"], [type="submit"], [type="checkbox"], [type="radio"]), textarea')
		, $checkboxEles = $form.find('input[type="checkbox"]')
		, $radioEles = $form.find('input[type="radio"]')
		, $selects = $form.find('select')
		, obj = {}

	$textEles.each(function() {
		var $ele = $(this)
			, name = $ele.attr('name')
		if(name) {
			obj[name] = $ele.val()
		}
	})

	$checkboxEles.each(function() {
		var $ele = $(this)
			, name = $ele.attr('name')
		if(name && $ele.is(':checked')) {
			obj[name] = obj[name] || []
			obj[name].push($ele.val())
		}
	})

	$radioEles.each(function() {
		var $ele = $(this)
			, name = $ele.attr('name')
		if(name && $ele.is(':checked')) {
			obj[name] = $ele.val()
		}
	})

	$selects.each(function() {
		var $ele = $(this)
			, name = $ele.attr('name')
		if(name) {
			obj[name] = $ele.val()
		}
	})

	return obj
}


module.exports = objectize
