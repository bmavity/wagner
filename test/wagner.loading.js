;(function(module) {
	module.define(function(papageno, cleanEnv) {
		papageno.subject('wagner', function() {
			this.context('when loaded', function() {
				cleanEnv.executeFile('./nodeEntry.js', this)
			})

			this.observation('should export module object to global object', function(globalObj) {
				this(globalObj).should.not['be null']()
			})
		})

		papageno.subject('wagner', function() {
			this.context('when loaded 2', function() {
				cleanEnv.executeFile('./nodeEntry.js', this)
			})

			this.observation('should export module object to global object', function(globalObj) {
				this(globalObj).should.not['be null']()
			})
		})
	})
})(new Module)