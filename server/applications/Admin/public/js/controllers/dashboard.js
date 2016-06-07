/**
 * Created by Jairo Martinez on 5/19/15.
 */
app.controller('DashboardCtrl', function ($scope, $timeout, $interval, $modal, analytics, DTOptionsBuilder, DTColumnDefBuilder) {

	$scope.info = {
		ctOnline: '0/0',
		wdOnline: '0/0',
		tpOnline: '0/0',
		occupied: '0/0',
		scheduled: '0/0',
		duration: '00:00:00'
	};

	var Collect = function(){
		$scope.info.occupied = analytics.occupied($scope.ao.workspaces);
		$scope.info.scheduled = analytics.scheduled($scope.ao.workspaces);
		$scope.info.ctOnline = analytics.online($scope.ao.controllers);
		$scope.info.duration = analytics.duration($scope.ao.events);
		$scope.info.tpOnline = analytics.online($scope.ao.touchpanels);
		$scope.info.wdOnline = analytics.online($scope.ao.wayfinders);
	};

	$timeout(Collect,2000);

	$scope.$on('update', function(){
		Collect();
	});
});