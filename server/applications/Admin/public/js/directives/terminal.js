/**
 * Created by Jairo Martinez on 6/8/15.
 */
app.directive('terminal', function(socket) {
	return {
		restrict: 'E',
		scope: {
			name: '@'
		},
		template: '<span>Hello {{name}}<div class="term"></div></span>',
		link: function(scope, elem, attrs) {
			var term = new Terminal({
				cols: 80,
				rows: 24,
				screenKeys: true
			});
			// window.w = elem;
			term.on('data', function(data) {
				socket.emit('data', data);
			});

			socket.on('data', function(data) {
				term.write(data);
			});

			socket.on('disconnect', function() {
				term.destroy();
			});

			term.open(elem.find("div")[0]);
			term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');
		}
	}
});