/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.controller('SideBarCtrl', function ($scope, $window, $localStorage, $sessionStorage, $modal, info) {
	$scope.locList = [];
	$scope.flrList = [];
	$scope.location = '';
	$scope.locUuid = '';
	$scope.showFloors = false;

	$scope.selectLocation = function (lc) {
		$scope.locUuid = lc.uuid;

		info.floorList(lc.uuid).then(
			function (res) {
				$scope.flrList = res.data.floors;
				$scope.location = res.data.name;
				$scope.showFloors = true;
			},
			function (err) {

			})
	};

	$scope.selectFloor = function (fl) {
		console.log(fl);
		var a = $scope.locUuid;
		var b = fl.uid;

		$scope.sidebar = false;
		$window.location.href = $window.location.origin + '/?locationId=' + a + '&floorId=' + b;
	};

	var initSideBar = function () {
		if($scope.session.locList.length > 0){
			$scope.locList = $scope.session.locList;
		} else {
			info.locationList().then(
				function (res) {
					$scope.locList = res.data;
				},
				function (err) {
				});
		}
	};

	initSideBar();
});