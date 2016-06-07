/**
 * Created by Jairo Martinez on 6/4/15.
 */

app.directive('clock',function(){
	return {
		restrict: 'EA',
		$scope: {},
		template: '<h3 class="font-extra-bold font-uppercase">{{time | date: "mediumTime"}}</h3>',
		controller: function ($scope, $timeout) {
			$scope.tickInterval = 1000; //ms

			var tick = function () {
				$scope.time = Date.now(); // get the current time
				$timeout(tick, $scope.tickInterval); // reset the timer
			};

			// Start the timer
			$timeout(tick, $scope.tickInterval);
		}
	}
});
