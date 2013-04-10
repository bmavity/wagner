
function click(root) {
	
}

function createSelector(name) {
	return [
		'#' + name
	, '.' + name
	, '[name="' + name + '"]'
	].join(',')
}

module.exports = function(root) {
	var handlers = {}
		, $root = root || this._$root
		, self = this

	function addHandler(name, handler) {
		handlers[name] = handler
	}

	$root.click(function(evt) {
		var $target = $(evt.target, $root)
			, matchingHandler

		if($target.attr('type') === 'submit') return
		
		evt.preventDefault()

		function matchesHandler(name) {
			if($target.closest(createSelector(name)).length) {
				matchingHandler = handlers[name]
				return true
			}
		}

		if(Object.keys(handlers).some(matchesHandler)) {
			matchingHandler()
		}
	})

	this.activate = addHandler
	return this
}