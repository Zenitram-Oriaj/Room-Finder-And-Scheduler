/**
 * Created by Jairo Martinez on 6/2/15.
 */
app.controller('TouchPanelCtrl', function($scope, $modal, DTOptionsBuilder, DTColumnBuilder){
	$scope.lastUpdate = new Date();

	$scope.dtOptions = DTOptionsBuilder.newOptions()
		.withOption('processing', true);

	$scope.dtColumns = [
		DTColumnBuilder.newColumn('uuid').withTitle('UUID'),
		DTColumnBuilder.newColumn('ip').withTitle('IP Address'),
		DTColumnBuilder.newColumn('uptime').withTitle('Up-Time (Mins)'),
		DTColumnBuilder.newColumn('status').withTitle('Status'),
		DTColumnBuilder.newColumn('createdAt').withTitle('Added On')
	];

	$scope.touchPanelDetail = function (tp) {

		var winClass = "hmodal-info";
		tp.showSupport = true;

		if (tp.status == "OFFLINE") {
			winClass = "hmodal-danger";
			tp.showSupport = false;
		}

		var mi = $modal.open({
			templateUrl: 'views/modals/touchpanelDetail.html',
			controller:  TpDetailModalCtrl,
			windowClass: winClass,
			animation: true,
			resolve:     {
				tp: function () {
					return tp;
				}
			}
		});

		mi.result.then(
			function (tp) {

			},
			function () {

			});
	};
});

function TpDetailModalCtrl($scope, $modalInstance, tp) {
	$scope.tp = tp;

	$scope.config = function () {
		$modalInstance.close($scope.tp);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}