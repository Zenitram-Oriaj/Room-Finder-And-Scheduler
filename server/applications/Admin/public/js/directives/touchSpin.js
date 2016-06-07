app.directive('touchSpin', touchSpin);

/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */
function touchSpin() {
	return {
		restrict: 'A',
		scope:    {
			spinOptions: '='
		},
		link:     function (scope, element, attrs) {
			var options = {
				min: 1024,
				max: 65535,
				step: 0.1,
				decimals: 0,
				boostat: 5,
				maxboostedstep: 10
			};

			scope.$watch(scope.spinOptions, function () {
				render();
			});
			var render = function () {
				$(element).TouchSpin(options);
			};
		}
	}
};