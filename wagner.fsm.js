var machina = require('machina')()
	, _ = require('underscore')

function isNotDefault(state) {
	return state !== 'default'
}

function componentStates($root) {
	var stateObj = {}
		, fsm
		, component = this
		, allStates

	function freezeStates() {
		fsm = new machina.Fsm({
			initialState: 'default'
		, states: stateObj
		})

		allStates = Object.keys(stateObj).filter(isNotDefault).join(' ')

		component.on('*', function(eventData) {
			fsm.handle(this.event, eventData)
		})

		this.sub('*', function(data) {
			fsm.handle(this.event, data)
		})
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

	this.freezeStates = freezeStates
	this.state = state
	this.transition = transition
	return this
}


module.exports = componentStates
