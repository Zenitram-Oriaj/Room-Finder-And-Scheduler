/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('modal', function ($ionicModal, $timeout) {
	var tmOut = {};

	this.show = function (id, $scope) {
		var template = '';
		switch (id) {
			case 1:{ template = 'Settings.html'; break; }
			case 2:{ template = 'ReserveRoom.html'; break; }
			case 3:{ template = 'ExtendMeeting.html'; break; }
			case 4:{ template = 'EndMeeting.html'; break; }
			case 5:{ template = 'ScreenSaver.html'; break; }
			case 6:{ template = 'MeetingDetails.html'; break; }
			case 7:{ template = 'TaskResults.html'; break; }
			case 8:{ template = 'UpdateReservation.html'; break; }
			case 9:{ template = 'CollectData.html'; break; }
			default: { break; }
		}

		$ionicModal.fromTemplateUrl('modals/' + template, {
			scope:     $scope,
			animation: 'none'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.modal.show();
			if (id == 9) {
				tmOut = $timeout(function () {
					$scope.modal.hide();
				}, 10 * 1000);
			}
			else if (id != 5) {
				tmOut = $timeout(function () {
					$scope.modal.hide();
				}, 2 * 60 * 1000);
			}
		});
	};

	this.hide = function (id, $scope) {
		if (id != 5) $timeout.cancel(tmOut);
		return $scope.modal.remove();
	};
});
