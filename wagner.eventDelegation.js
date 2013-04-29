
function click(root) {
	
}

function createSelector(name) {
	return [
		'#' + name
	, '.' + name
	, '[name="' + name + '"]'
	].join(',')
}

module.exports = function(opts) {
	var handlers = {}
		, $root = this._$root
		, component = this
		, isInitialized

	function addHandler(name, handler) {
		handlers[name] = handler
	}

	function initHandler() {
		if(isInitialized) return

		$root.click(function(evt) {
			var $target = $(evt.target, $root)
		    , $match
				, matchingHandler
			opts = opts || {}

			if(!opts.captureSubmitClick) {
				if($target.attr('type') === 'submit') {
					return
				}
				evt.preventDefault()
			}

			function matchesHandler(name) {
				var $potentialMatch = $target.closest(createSelector(name))
	      if($potentialMatch.length) {
	        $match = $potentialMatch
					matchingHandler = handlers[name]
					return true
				}
			}

			if(Object.keys(handlers).some(matchesHandler)) {
				matchingHandler($match)
			}
		})

		isInitialized = true
	}

	this.activate = addHandler
	return this
}