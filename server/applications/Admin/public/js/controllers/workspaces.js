/**
 * Created by Jairo Martinez on 6/2/15.
 */
app.controller('WorkspaceCtrl', function ($scope, $modal, $interval, data, sweetAlert, DTOptionsBuilder, DTColumnDefBuilder) {
	$scope.lastUpdate = new Date();

	$scope.$on('workspacesUpdate', function () {
		$scope.lastUpdate = new Date();
	});

	$scope.workspaceDetail = function (ws) {
		var winClass = "hmodal-info";
		var mi = $modal.open({
			templateUrl: 'views/modals/workspaceDetail.html',
			controller:  WsDetailModalCtrl,
			windowClass: winClass,
			resolve:     {
				ws:    function () {
					return ws;
				},
				types: function () {
					return $scope.ao.typeList;
				}
			}
		});

		mi.result.then(
			function (ws) {
				$scope.workspaceConfig(ws);
			},
			function () {

			});
	};

	$scope.workspaceConfig = function (ws) {
		var winClass = "hmodal-warning2";
		var mi = $modal.open({
			templateUrl: 'views/modals/workspaceConfig.html',
			controller:  WsConfigModalCtrl,
			windowClass: winClass,
			resolve:     {
				ws:    function () {
					return ws;
				},
				types: function () {
					return $scope.ao.typeList;
				}
			}
		});

		mi.result.then(
			function (ws) {
				if (ws.delete) {
					data.delete('ws', ws).then(
						function (res) {
							sweetAlert.swal({
								title: "Deleted",
								text:  "The Workspace was successfully removed",
								type:  "success"
							});
							$scope.$emit('reload', {});
						},
						function (err) {
							sweetAlert.swal({
								title: "Error",
								text:  err,
								type:  "error"
							});
						});
				}
				else if (ws.update) {
					data.update('ws', ws).then(
						function (res) {
							sweetAlert.swal({
								title: "Updated",
								text:  "The Workspace was successfully updated",
								type:  "success"
							});
							$scope.$emit('reload', {});
						},
						function (err) {
							sweetAlert.swal({
								title: "Error",
								text:  err,
								type:  "error"
							});
						});
				}
			},
			function () {

			});
	};

	$scope.eventDetail = function (evt) {
		var winClass = "hmodal-info";
		var mi = $modal.open({
			templateUrl: 'views/modals/eventDetail.html',
			controller:  EvtDetailModalCtrl,
			windowClass: winClass,
			resolve:     {
				evt: function () {
					return evt;
				}
			}
		});

		mi.result.then(
			function (ws) {
				$scope.workspaceConfig(ws);
			},
			function () {

			});
	};

	$scope.dtOptions = DTOptionsBuilder.newOptions()
		.withOption('processing', true)
		.withPaginationType('full_numbers');

	$scope.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4)
	];

});

function WsDetailModalCtrl($scope, $modalInstance, ws, types, data) {
	$scope.ws = ws;
	$scope.ws.schedules = {};
	$scope.typeList = types;

	if (ws.reservable) {
		data.schedules(ws).then(
			function (res) {
				console.log(res.data);
				$scope.ws.schedules = res.data;
			},
			function (err) {
			});
	}

	$scope.config = function () {
		$modalInstance.close(ws);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}

function WsConfigModalCtrl($scope, $modalInstance, ws, types) {
	$scope.ws = $.extend({}, ws);

	$scope.typeList = types;

	if ($scope.ws.reservable) $scope.ws.reservable = true;
	if ($scope.ws.allowLocal) $scope.ws.allowLocal = true;

	$scope.slctType = function () {
		$scope.ws.description = $scope.typeList[$scope.ws.type].description;
	};

	$scope.delete = function () {
		$scope.ws.delete = true;
		$modalInstance.close($scope.ws);
	};

	$scope.update = function () {
		$scope.ws.update = true;
		$modalInstance.close($scope.ws);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}

function EvtDetailModalCtrl($scope, $modalInstance, evt) {
	$scope.evt = evt;
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}