/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('reservation', function(timeDate){
	return {
		restrict: 'E',
		scope: {
			res: '=reservation'
		},
		template: '<li class = "widget" ng-click="widgetClick({{res.id}})">' +
		          '<div id = "wStrt" class = "widget-stime">' +
		          '<div class = "widget-title widget-{{res.wColor}}">' +
		          '<h2>{{res.host}}</h2></div>' +
		          '<div class = "widget-body widget-body-{{res.wColor}}">' +
		          '<h3>{{res.description}}</h3></div>' +
		          '<div class = "widget-footer widget-body-{{res.wColor}}">' +
		          '<h4>Duration: {{res.inf2}}</h4></div>' +
		          '</li>',
		controller: function($scope){
			$scope.res.wColor = 'default';
			$scope.res.sTime = timeDate.formatTimeString($scope.res.startTime);
			$scope.res.inf2 = timeDate.parseHourMinutes($scope.res.duration);

			if ($scope.res.status === 'success') {
				$scope.res.wColor = 'available';
			}

			if ($scope.res.description && s.res.description.length > 33) {
				$scope.res.description = $scope.res.description.substr(0, 30) + "...";
			}
		}
	}
});