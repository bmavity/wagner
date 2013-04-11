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

function getStateParts(fullState) {
	var nameParts = fullState.split('.')
	return {
	  state: nameParts.pop()
	, namespace: nameParts.join('.')
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
		var state = getStateParts(nextState).state
		component._$root.removeClass(allStates)
		if(isNotDefault(nextState)) {
			component._$root.addClass(state)
		}
		fsm.transition(state)
	}


	this.addState = addState
	this.handle = handle
	this.transition = transition
}

function componentStates() {
	var component = this
		, fsms = {}

	function getFsm(namespace) {
		fsms[namespace] = fsms[namespace] || new ComponentFsm(component, namespace)
		return fsms[namespace]
	}

	function handleEvent(data) {
		var evt = this.event
		_.forEach(fsms, function(fsm) {
			fsm.handle(evt, data)
		})
	}

	component.on('*', handleEvent)

	if(component.sub) {
		component.sub('*', handleEvent)
	}

	function state(name, handlers) {
		if(!handlers) {
			handlers = name
			name = 'default'
		}

		var parts = getStateParts(name)
		getFsm(parts.namespace).addState(parts.state, handlers)
	}

	function transition(nextState) {
		getFsm(getStateParts(nextState).namespace).transition(nextState)
	}


	this.state = state
	this.transition = transition
	return this
}


module.exports = componentStates
