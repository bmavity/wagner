var machina = require('machina')()
	, _ = require('underscore')

function isNotDefault(state) {
	return state !== 'default'
}

function createTransitionTo(component, state) {
	return function() {
		component.transition(state)
	}
}

function ComponentFsm(component) {
	var fsm = new machina.Fsm({
			  states: {}
			})
		, allStates

	function addState(name, handlers) {
		fsm.states[name] = _.reduce(handlers, function(all, handler, evtName) {
			all[evtName] = _.isString(handler) ? createTransitionTo(component, handler) : handler
			return all
		}, {})
		
		allStates = Object.keys(fsm.states).filter(isNotDefault).join(' ')

		if(!fsm.state && !isNotDefault(name)) {
			transition('default')
		}
	}

	function handle(evt, data) {
		fsm.handle(evt, data)
	}

	function transition(nextState) {
		component._$root.removeClass(allStates)
		if(isNotDefault(nextState)) {
			component._$root.addClass(nextState)
		}
		fsm.transition(nextState)
	}


	this.addState = addState
	this.handle = handle
	this.transition = transition
}

function componentStates() {
	var component = this
		, fsm = new ComponentFsm(component)

	component.on('*', function(eventData) {
		fsm.handle(this.event, eventData)
	})

	if(component.sub) {
		component.sub('*', function(data) {
			fsm.handle(this.event, data)
		})
	}

	function state(name, handlers) {
		if(!handlers) {
			handlers = name
			name = 'default'
		}

		var nameParts = name.split('.')
			, state = nameParts.pop()
			, namespace = nameParts.join('.')

		fsm.addState(state, handlers)
	}

	function transition(nextState) {
		var nameParts = nextState.split('.')
			, state = nameParts.pop()
			, namespace = nameParts.join('.')

		fsm.transition(state)
	}


	this.state = state
	this.transition = transition
	return this
}


module.exports = componentStates
