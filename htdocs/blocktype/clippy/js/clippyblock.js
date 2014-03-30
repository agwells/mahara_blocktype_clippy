if (typeof clippyblock === 'undefined') {
	var clippyblock = {
		agent: null,
		foo: "bar",
		
		_loadcb: function(agent) {
			this.agent = agent;
			this.agent.show();
		},
		
		switchagent: function(agentname) {
			if (this.agent == null) {
				clippy.load(agentname, jQuery.proxy(clippyblock, '_loadcb'));
			}
			else {
				this.agent.hide(false, function() {
					clippy.load(agentname, jQuery.proxy(clippyblock, '_loadcb'));
				});
			}
		},
		
		speak: function(speakme) {
			if (clippyblock.agent) {
				clippyblock.agent.speak(speakme);
			}
		}
	};
}
