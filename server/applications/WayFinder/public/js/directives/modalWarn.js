/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('modalWarn', function ($interval, $timeout) {
	return {
		restrict:   'EA',
		scope:      false,
		template:   '<div class="alert alert-danger" ng-show = "mdAlert">' +
		            '<h4>This Pop-Up Will Close In <b>{{timeLeft}}</b> Seconds. Tap Anywhere Within This Pop-Up To Continue Viewing It</h4>' +
		            '</div>',
		controller: function ($scope, $interval, $timeout) {
			$scope.tmOut = {};
			$scope.tmCnt = {};
			$scope.timeLeft = 0;
			$scope.mdAlert = false;

			$scope.runTimeout = function () {
				$scope.timeLeft = 60;
				$scope.mdAlert = false;
				$scope.tmOut = $timeout(function () {
					$scope.mdAlert = true;
					$scope.tmCnt = $interval(function () {
						$scope.timeLeft--;
						if ($scope.timeLeft <= 0) {
							$interval.cancel($scope.tmCnt);
							$scope.cancel();
						}
					}, 1000);
				}, 30 * 1000);
			};

			$scope.allClicks = function () {
				$timeout.cancel($scope.tmOut);
				if ($scope.mdAlert) {
					$interval.cancel($scope.tmCnt);
				}
				$scope.runTimeout();
			};

			$scope.runTimeout();
		}
	}
});