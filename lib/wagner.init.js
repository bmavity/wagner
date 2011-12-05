define('component.init.messaging', function(component, events, decorate) {
  component.addToChain('creating environment', 'global message', function(input, env, next) {
    env.publish = window.publish;
    env.subscribe = window.subscribe;
    next();
  });

  var localMesages = new events.Emitter();
  component.addToChain('creating environment', 'local message', function(input, env, next) {
    env.pub = function(evt) {
      localMessages.emit.apply(localMessages, Array.prototype.slice(arguments, 0));
    };

    env.sub = function(evt, fn) {
      localMessages.on.apply(localMessages, Array.prototype.slice(arguments, 0));
    };
    next();
  });

  component.addToChain('creating environment', 'saga', function(input, env, next) {
    env.saga = function(fn) {
      fn();
    };
    next();
  });

  component.addToChain('creating environment', 'ajax', function(input, env, next) {
    env.get = 'get'; //$.get;
    next();
  });
});
