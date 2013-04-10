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

function ComponentFsm() {

}

function componentStates($rootEle) {
	var stateObj = {}
		, fsm = new machina.Fsm({
			  states: stateObj
			})
		, component = this
		, $root = $rootEle || component._$root
		, allStates

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
		stateObj[name] = _.reduce(handlers, function(all, handler, evtName) {
			all[evtName] = _.isString(handler) ? createTransitionTo(component, handler) : handler
			return all
		}, {})
		
		allStates = Object.keys(stateObj).filter(isNotDefault).join(' ')

		if(!fsm.state && !isNotDefault(name)) {
			transition('default')
		}
	}

	function transition(nextState) {
		$root.removeClass(allStates)
		if(isNotDefault(nextState)) {
			$root.addClass(nextState)
		}
		fsm.transition(nextState)
	}


	this.state = state
	this.transition = transition
	return this
}


module.exports = componentStates
