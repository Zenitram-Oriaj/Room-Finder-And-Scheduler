/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.controller('ModalReservationCtrl', function ($scope, $modalInstance, ws, reservations) {
	$scope.reservations = reservations;
	$scope.ws = ws;
	$scope.predicate = 'startTime';
	$scope.noReservations = false;
	$scope.notReservable = false;
	$scope.ws.change = false;

	if (!ws.reservable) {
		$scope.notReservable = true;
	}
	else if ($scope.reservations !== null && $scope.reservations.length > 0) {
		$scope.reservations.forEach(function (r) {
			var dt = new Date();

			// Fix Hours Based On TimeZone Offset
			r.startTime = new Date(r.startTime);
			r.stopTime = new Date(r.stopTime);

			// Determine if this meeting is today and if it is currently active, then make row green
			if (dt.getDate() == r.startTime.getDate()) {
				r.show = true;

				if (dt >= r.startTime && dt <= r.stopTime) r.status = 'success';
			}

			// Determine if the reservation has a host
			r.host = (r.createdForName.length > 0 ? r.createdForName : r.createdByName);

			// Show Option Buttons If ID Matches
			r.opts = (r.createdById == 123403);

		});
	} else {
		$scope.noReservations = true;
	}

	$scope.update = function (res) {
		$scope.ws.change = true;
		$scope.ws.res = res;
		console.log($scope.ws);
		$modalInstance.close($scope.ws);
	};

	$scope.reserve = function () {
		$modalInstance.close($scope.ws);
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

app.controller('ModalLocalReserveCtrl', function ($scope, $modalInstance, timeSvc, ws, obj) {
	$scope.ws = ws;
	$scope.res = obj;

	$scope.res.create = true;
	$scope.res.change = false;
	$scope.res.remove = false;

	$scope.duration = 0;
	$scope.minutes = 15;
	$scope.startTime = new Date();
	$scope.stopTime = new Date();

	$scope.startTime.setSeconds(0);
	$scope.stopTime.setMinutes($scope.startTime.getMinutes() + $scope.minutes);
	$scope.stopTime.setSeconds(0);

	$scope.hstep = 1;
	$scope.mstep1 = 1;
	$scope.mstep2 = 15;

	$scope.options = {
		hstep: [1, 2, 3],
		mstep: [1, 5, 10, 15, 25, 30]
	};

	$scope.ismeridian = true;

	$scope.toggleMode = function () {
		$scope.ismeridian = !$scope.ismeridian;
	};

	$scope.changeStart = function () {
		var t = new Date($scope.startTime);
		t.setMinutes(t.getMinutes() + $scope.minutes);
		$scope.stopTime = t;

	};

	$scope.incrementMinutes = function () {
		if ($scope.minutes < 480) {
			$scope.minutes = $scope.minutes + 15;
		}
		$scope.updateMinutes();
	};

	$scope.decrementMinutes = function () {
		if ($scope.minutes >= 30) {
			$scope.minutes = $scope.minutes - 15;
		}
		$scope.updateMinutes();
	};

	$scope.updateMinutes = function () {
		var t = new Date($scope.startTime);
		$scope.stopTime = t.setMinutes($scope.startTime.getMinutes() + $scope.minutes);
	};

	$scope.reserve = function () {
		var ds = new Date($scope.startTime);
		var dn = new Date($scope.stopTime);

		$scope.res.startTime = timeSvc.GetDateTimeStr(ds);
		$scope.res.stopTime = timeSvc.GetDateTimeStr(dn);
		$scope.res.duration = ($scope.minutes * 60 * 1000);
		$scope.res.description = 'Local Reservation';
		$scope.res.notes = 'A local reservation made from Way Finder Display';
		$scope.res.numOfAttendees = 1;
		$scope.res.resourceId = $scope.ws.reserveId;
		$scope.res.timeZoneId = $scope.ws.timeZoneId;

		console.log($scope.res);

		$modalInstance.close($scope.res);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

app.controller('ModalUpdateResCtrl', function ($scope, $modalInstance, timeSvc, ws) {

	var dt = new Date();
	$scope.ws = ws;
	$scope.res = ws.res;

	$scope.res.create = false;
	$scope.res.change = false;
	$scope.res.remove = false;

	$scope.active = false;

	$scope.hstep = 1;
	$scope.mstep1 = 1;

	$scope.minutes = ($scope.res.duration / 10000) / 60;

	if (dt >= $scope.res.startTime && dt <= $scope.res.stopTime) $scope.active = true;

	$scope.incrementMinutes = function () {
		if ($scope.minutes < 120) {
			$scope.minutes = $scope.minutes + 15;
			$scope.changeStopTime();
		}
	};

	$scope.decrementMinutes = function () {
		if ($scope.minutes >= 30) {
			$scope.minutes = $scope.minutes - 15;
			$scope.changeStopTime();
		}
	};

	$scope.changeStopTime = function () {
		var t = new Date($scope.res.startTime);
		$scope.res.stopTime = t.setMinutes($scope.res.startTime.getMinutes() + $scope.minutes);
	};

	$scope.extend = function () {
		var ds = new Date($scope.startTime);
		var dn = new Date($scope.stopTime);

		$scope.res.change = true;

		$scope.res.startTime = timeSvc.GetDateTimeStr(ds);
		$scope.res.stopTime = timeSvc.GetDateTimeStr(dn);

		$scope.res.duration = (($scope.minutes + 15) * 60 * 1000);
		$modalInstance.close($scope.res);
	};

	$scope.end = function () {
		var ds = new Date($scope.startTime);
		var dn = new Date($scope.stopTime);

		$scope.res.startTime = timeSvc.GetDateTimeStr(ds);
		$scope.res.stopTime = timeSvc.GetDateTimeStr(dn);

		$scope.res.change = true;

		$scope.res.duration = (dt - $scope.res.startTime);
		$modalInstance.close($scope.res);
	};

	$scope.remove = function () {
		$scope.res.remove = true;
		$modalInstance.close($scope.res);
	};

	$scope.update = function () {
		$scope.res.change = true;
		$scope.res.duration = ($scope.minutes * 60 * 1000);

		$modalInstance.close($scope.res);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

app.controller('ModalResultsCtrl', function ($scope, $modalInstance, obj) {
	$scope.obj = obj;

	$scope.cancel = function () {
		$modalInstance.dismiss('close');
	};
});

app.controller('ModalResDetailCtrl', function ($scope, $modalInstance, reservation) {

	$scope.reservation = reservation;

	$scope.list = reservation.attendeeList.split(',');

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

app.controller('ModalLoginCtrl', function ($scope, $modalInstance) {
	$scope.creds = {
		email: '',
		pass:  ''
	};

	$scope.login = function () {
		$modalInstance.close($scope.creds);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('close');
	};
});

app.controller('ModalConfigCtrl', function ($scope, $modalInstance, ao, lcs, info) {
	$scope.ao = ao;
	$scope.lcs = lcs;
	$scope.fls = [];

	$scope.toggleStateText = ($scope.ao.turnkey == true) ? 'on' : 'off';

	$scope.toggleChange = function () {
		$scope.ao.turnkey = !$scope.ao.turnkey;
		$scope.toggleStateText = ($scope.ao.turnkey == true) ? 'on' : 'off';
	};

	if ($scope.ao.dflt.locationId != 'GBL') {
		info.floorList($scope.ao.dflt.locationId).then(
			function (res) {
				$scope.fls = res.data.floors;
			},
			function (err) {

			});
	}

	$scope.slctLocation = function () {
		info.floorList($scope.ao.dflt.locationId).then(
			function (res) {
				$scope.fls = res.data.floors;
			},
			function (err) {
			});
	};

	$scope.slctFloor = function () {

	};

	$scope.clear = function () {
		$scope.ao.clear = true;
		$modalInstance.close($scope.ao);
	};

	$scope.submit = function () {
		$modalInstance.close($scope.ao);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('close');
	};
});

