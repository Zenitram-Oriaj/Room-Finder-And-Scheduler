/**
 * Created by Jairo Martinez on 6/9/15.
 */
app.controller('AnalyticsCtrl', function($scope, $interval, analytics, colors){
	$scope.lastUpdate = new Date();

	$scope.opts = {
		segmentShowStroke:     true,
		segmentStrokeColor:    "#fff",
		segmentStrokeWidth:    2,
		percentageInnerCutout: 10, // This is 0 for Pie charts
		animationSteps:        100,
		animationEasing:       "easeOutBounce",
		animateRotate:         true,
		animateScale:          false
	};

	$scope.data = [];

	function collectAnalytics() {
		analytics.fromToday($scope.ao.controllers, $scope.ao.events, function (vals) {
			if (vals && vals.length > 0) {
				$scope.data.length = 0;
				for (var i = 0; i < vals.length; i++) {
					var b = {
						value: vals[i].total,
						label:  vals[i].name,
						color: colors.donut[i].color,
						highlight: colors.donut[i].highlight
					};
					$scope.data.push(b);
				}
			}
		});
	}

	collectAnalytics();
});