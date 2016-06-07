/**
 * Created by Jairo Martinez on 6/2/15.
 */
app.controller('WayFinderCtrl', function($scope, $modal, DTOptionsBuilder, DTColumnBuilder){
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

	$scope.wayfinderDetail = function (wf) {

		var winClass = "hmodal-info";
		wf.showSupport = true;

		if (wf.status == "OFFLINE") {
			winClass = "hmodal-danger";
			wf.showSupport = false;
		}

		var mi = $modal.open({
			templateUrl: 'views/modals/wayfinderDetail.html',
			controller:  WfDetailModalCtrl,
			windowClass: winClass,
			animation: true,
			resolve:     {
				wf: function () {
					return wf;
				}
			}
		});

		mi.result.then(
			function (wf) {

			},
			function () {

			});
	};
});

function WfDetailModalCtrl($scope, $modalInstance, wf) {
	$scope.wf = wf;

	$scope.config = function () {
		$modalInstance.close($scope.wf);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}