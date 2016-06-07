/**
 * Created by Jairo Martinez on 6/2/15.
 */

app.controller('ControllerCtrl', function ($scope, $modal, sweetAlert, data, DTOptionsBuilder, DTColumnDefBuilder) {
	$scope.lastUpdate = new Date();

	$scope.$on('controllersUpdate', function () {
		$scope.lastUpdate = new Date();
	});

	$scope.$on('discoversUpdate', function () {
		$scope.lastUpdate = new Date();
	});

	$scope.discoverDetail = function (ds) {

		var winClass = "hmodal-info";
		ds.showSupport = true;

		if (ds.status == "down") {
			winClass = "hmodal-danger";
			ds.showSupport = false;
		}

		var mi = $modal.open({
			templateUrl: 'views/modals/discoverDetail.html',
			controller:  DsDetailModalCtrl,
			windowClass: winClass,
			resolve:     {
				ds: function () {
					return ds;
				}
			}
		});

		mi.result.then(
			function (ds) {

			},
			function () {

			});
	};

	$scope.controllerDetail = function (ct) {

		var winClass = "hmodal-info";
		ct.showSupport = true;

		if (ct.status == "OFFLINE") {
			winClass = "hmodal-danger";
			ct.showSupport = false;
		}

		var mi = $modal.open({
			templateUrl: 'views/modals/controllerDetail.html',
			controller:  CtDetailModalCtrl,
			windowClass: winClass,
			animation: true,
			resolve:     {
				ct: function () {
					return ct;
				}
			}
		});

		mi.result.then(
			function (ct) {
				$scope.controllerConfig(ct);
			},
			function () {

			});
	};

	$scope.controllerConfig = function (obj) {
		var ct = $.extend({}, obj);
		var winClass = "hmodal-warning2";
		ct.showSupport = true;

		if (ct.status == "OFFLINE") {
			winClass = "hmodal-danger";
			ct.showSupport = false;
		}

		var mi = $modal.open({
			templateUrl: 'views/modals/controllerConfig.html',
			controller:  CtConfigModalCtrl,
			windowClass: winClass,
			animation: true,
			resolve:     {
				ct: function () {
					return ct;
				},
				ws: function () {
					return $scope.ao.workspaces;
				}
			}
		});

		mi.result.then(
			function (ct) {
				if (ct.delete) {
					data.delete('ct', ct).then(
						function (res) {
							sweetAlert.swal({
								title: "Deleted",
								text:  "The Controller was successfully removed",
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
				else if (ct.update) {
					data.update('ct', ct).then(
						function (res) {
							sweetAlert.swal({
								title: "Updated",
								text:  "The Controller was successfully updated",
								type:  "success"
							});
							$scope.$emit('reload', {});
						},
						function (err) {
							sweetAlert.swal({
								title: "Error",
								text:  err.data.message,
								type:  "error"
							});
						});
				}
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
		DTColumnDefBuilder.newColumnDef(4),
		DTColumnDefBuilder.newColumnDef(5)
	];

	$scope.dtDsColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4),
		DTColumnDefBuilder.newColumnDef(5),
		DTColumnDefBuilder.newColumnDef(6)
	];
});

/**
 * CtDetailModalCtrl
 * @param $scope
 * @param $modalInstance
 * @param ct
 */
function CtDetailModalCtrl($scope, $modalInstance, ct) {
	$scope.ct = ct;
	
	$scope.config = function () {
		$modalInstance.close($scope.ct);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}

/**
 * CtConfigModalCtrl
 * @param $scope
 * @param $modalInstance
 * @param ct
 * @param ws
 */
function CtConfigModalCtrl($scope, $modalInstance, ct, ws) {
	$scope.ct = ct;
	$scope.ws = ws;

	$scope.slctParms = [
		{label: 'Auto', id: 'A'},
		{label: 'Manual', id: 'M'}
	];

	$scope.updateMode = function () {
		$scope.manualSlct = ($scope.ct.mode == 'M');
	};

	$scope.slctWs = function () {
		for (var i = 0; i < $scope.ws.length; i++) {
			if ($scope.ws[i].uuid == $scope.ct.workspaceUuid) {
				$scope.ct.workspaceName = $scope.ws[i].name;
				break;
			}
		}
	};

	$scope.delete = function () {
		$scope.ct.delete = true;
		$modalInstance.close($scope.ct);
	};

	$scope.update = function () {
		$scope.ct.update = true;
		$modalInstance.close($scope.ct);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}

/**
 * DsDetailModalCtrl()
 * @param $scope
 * @param $modalInstance
 * @param ds
 */
function DsDetailModalCtrl($scope, $modalInstance, ds) {
	$scope.ds = ds;

	$scope.config = function () {
		$modalInstance.close($scope.ds);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}