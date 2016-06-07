/**
 * Created by Jairo Martinez on 5/19/15.
 */

app.controller('HeaderCtrl', function ($scope, $state, sweetAlert) {
	$scope.loginfo = {
		count: 0,
		flag:  'primary',
		items: []
	};

	function collectLogInfo() {
		var cnt = 0;
		$scope.loginfo.items.length = 0;

		if($scope.ao.info.mempcnt > 90){
			$scope.loginfo.flag = 'danger';
			var item = {
				lvl: 'danger',
				typ: 'ERR',
				msg: 'Memory Utilization At ' + $scope.ao.info.mempcnt.toString() + '%',
				href: '#/sv/info'
			};

			$scope.loginfo.items.push(item);
		}
		else if($scope.ao.info.mempcnt > 75){
			$scope.loginfo.flag = 'warning';
			var item = {
				lvl: 'warning',
				typ: 'WRN',
				msg: 'Memory Utilization At ' + $scope.ao.info.mempcnt.toString() + '%',
				href: '#/sv/info'
			};

			$scope.loginfo.items.push(item);
		}

		/////////////////////////////////////////////////////////////////////////////////

		cnt = 0;
		for (var i in $scope.ao.controllers) {
			if (!$scope.ao.controllers[i].workspaceUuid || $scope.ao.controllers[i].workspaceUuid.length < 2) cnt += 1;
		}

		if (cnt > 0) {
			$scope.loginfo.flag = 'warning';
			var item = {
				lvl: 'warning',
				typ: 'WRN',
				msg: cnt.toString() + ' Controller(s) Not Assigned',
				href: '#/ct/info'
			};

			$scope.loginfo.items.push(item);
		}

		/////////////////////////////////////////////////////////////////////////////////

		cnt = 0;
		for (var i in $scope.ao.controllers) {
			if ($scope.ao.controllers[i].status == 'OFFLINE') cnt += 1;
		}

		if (cnt > 0) {
			$scope.loginfo.flag = 'danger';
			var item = {
				lvl: 'danger',
				typ: 'ERR',
				msg: cnt.toString() + ' Controller(s) OFFLINE',
				href: '#/ct/info'
			};

			$scope.loginfo.items.push(item);
		}

		/////////////////////////////////////////////////////////////////////////////////

		cnt = 0;
		for (var i in $scope.ao.touchpanels) {
			if ($scope.ao.touchpanels[i].status == 'OFFLINE') cnt += 1;
		}

		if (cnt > 0) {
			$scope.loginfo.flag = 'danger';
			var item = {
				lvl: 'danger',
				typ: 'ERR',
				msg: cnt.toString() + ' TouchPanel(s) OFFLINE',
				href: '#/tp/info'
			};

			$scope.loginfo.items.push(item);
		}

		/////////////////////////////////////////////////////////////////////////////////

		cnt = 0;
		for (var i in $scope.ao.wayfinders) {
			if ($scope.ao.wayfinders[i].status == 'OFFLINE') cnt += 1;
		}

		if (cnt > 0) {
			$scope.loginfo.flag = 'danger';
			var item = {
				lvl: 'danger',
				typ: 'ERR',
				msg: cnt.toString() + ' WayFinders(s) OFFLINE',
				href: '#/wf/info'
			};

			$scope.loginfo.items.push(item);
		}

		/////////////////////////////////////////////////////////////////////////////////

		$scope.loginfo.count = $scope.loginfo.items.length;
	}

	collectLogInfo();

	$scope.$on('infoUpdate', collectLogInfo);

	$scope.logout = function () {
		sweetAlert.swal({
				title:              "Log Out",
				text:               "Are You Sure You Want To Proceed?",
				type:               'warning',
				showCancelButton:   true,
				confirmButtonColor: "#62cb31",
				confirmButtonText:  "YES",
				cancelButtonColor:  "#c0392b",
				cancelButtonText:   "NO",
				closeOnConfirm:     true,
				closeOnCancel:      true
			},
			function (isConfirm) {
				if (isConfirm) {
					$scope.appLoggedOut();
					$state.go('login');
				}
			});
	};
});