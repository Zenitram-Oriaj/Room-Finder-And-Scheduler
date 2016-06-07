/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.controller('ScheduleCtrl', function ($scope, $modal, schedule) {
	$scope.schedules = [];
	$scope.predicate = 'startTime';

	$scope.getData = function () {
		schedule.collect().then(
			function (res) {
				$scope.ws = res.data;
				console.log($scope.ws);

				$scope.ws.forEach(function (w) {
					w.reservations.forEach(function (r) {

						var dt = new Date();
						var n = (dt.getTimezoneOffset() / 60 );

						// Fix Hours Based On TimeZone Offset
						r.startTime = new Date(r.startTime);
						r.stopTime = new Date(r.stopTime);

						//r.startTime.setHours(r.startTime.getHours() + n);
						//r.stopTime.setHours(r.stopTime.getHours() + n);

						// Determine if this meeting is today and if it is currently active, then make row green
						if (dt.getDate() == r.startTime.getDate()) {
							r.show = true;

							if (dt >= r.startTime && dt <= r.stopTime) r.status = 'success';
						}

						// Determine if the reservation has a host
						r.host = (r.createdForName.length > 0 ? r.createdForName : r.createdByName);

						// If the meeting is in the past, hide it.
						r.hide = (dt > r.stopTime);

					})
				});

				$scope.resInfo = $scope.ws;

			},
			function (err) {
				console.error('ERROR :: CAN NOT GET DATA FROM SERVER :: ' + err);
			});
	};

	$scope.details = function (res) {
		var modalInstance = $modal.open({
			templateUrl: '../partials/modelResDetail.html',
			controller:  'modalReservationController',
			size:        'lg',
			resolve:     {
				reservation: function () {
					return res;
				}
			}
		});

		modalInstance.result.then(
			function (selectedItem) {
				$scope.selected = selectedItem;
			},
			function () {
				console.log('Modal dismissed at: ' + new Date());
			});
	};

});