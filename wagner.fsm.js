var machina = require('machina')()
	, _ = require('underscore')

function isNotDefault(state) {
	return state !== 'default'
}

function componentStates() {
	var stateObj = {}
		, $root
		, fsm
		, component = this
		, allStates

	function freezeStates() {
		fsm = new machina.Fsm({
			initialState: 'default'
		, states: stateObj
		})

		allStates = Object.keys(stateObj).filter(isNotDefault).join(' ')
		console.log(allStates)

		_.reduce(stateObj, function(s, state) {
			_.forEach(state, function(handler, evt) {
				if(s.indexOf(evt) === -1 && s.indexOf('_') !== 0) {
					s.push(evt)
				}
			})
			return s
		}, []).forEach(function(evt) {
			component.on(evt, function(eventData) {
				fsm.handle(evt, eventData)
			})
		})

/*
		this.subscribe('*', function() {
			console.log(arguments)
		})
*/
	}

	function state(name, handlers) {
		if(!handlers) {
			handlers = name
			name = 'default'
		}
		stateObj[name] = handlers
	}

	function transition(nextState) {
		$root.removeClass(allStates)
		if(isNotDefault(nextState)) {
			$root.addClass(nextState)
		}
		fsm.transition(nextState)
	}

	this.on('init', function(root) {
		$root = $(root)
	})

	this.freezeStates = freezeStates
	this.state = state
	this.transition = transition
	return this
}


module.exports = componentStates
