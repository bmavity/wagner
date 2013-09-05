require('./node_modules/hammerjs/dist/jquery.hammer')

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
	opts = opts || {}

	function addHandler(name, handler) {
		initHandler()
		handlers[name] = handler
	}

	function initHandler() {
		if(isInitialized) return

		$root.hammer().on('tap', handleActivation)

		isInitialized = true
	}

	function handleActivation(evt) {
		if(evt.isDefaultPrevented()) {
			console.log('prevented')
			return
		}
		var $target = $(evt.target, $root)
	    , $match
			, matchingHandler

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
	}

	this.activate = addHandler
	return this
}