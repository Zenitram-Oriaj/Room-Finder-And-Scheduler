/**
 * Created by Jairo Martinez on 6/2/15.
 */
app.controller('ServerCtrl', function ($scope, $interval, $timeout, data, colors, DTOptionsBuilder, DTColumnDefBuilder) {
	$scope.lastUpdate = new Date();

	$scope.colWidth = 4;

	$scope.dataForInfo = false;
	$scope.dataForLogs = false;
	$scope.dataForMats = false;

	$scope.$on('historyUpdate', function () {
		//$scope.ao.history = $scope.ao.history;
		$scope.lastUpdate = new Date();
	});

	$scope.$on('infoUpdate', function () {
		//$scope.ao.info = $scope.ao.info;
		$scope.lastUpdate = new Date();
	});
	$scope.logs = [{
		id:       0,
		dateTime: new Date(),
		level:    '',
		event:    '',
		message:  ''
	}];

	$scope.appBtns = [{
		name: 'Discovery',
		show: $scope.ao.gateway.dscv.enabled,
		id:   'ds'
	}, {
		name: 'Controller',
		show: $scope.ao.gateway.ctrl.enabled,
		id:   'ct'
	}, {
		name: 'Server Monitoring',
		show: $scope.ao.gateway.pclg.enabled,
		id:   'pc'
	}, {
		name: 'WayFinder',
		show: $scope.ao.gateway.wyfd.enabled,
		id:   'wf'
	}, {
		name: 'Scheduler',
		show: $scope.ao.gateway.schd.enabled,
		id:   'sd'
	}, {
		name: 'Backup',
		show: $scope.ao.gateway.bkup.enabled,
		id:   'bk'
	}, {
		name: 'Analytics',
		show: $scope.ao.gateway.altc.enabled,
		id:   'at'
	}, {
		name: 'Terminal',
		show: $scope.ao.gateway.term.enabled,
		id:   'tm'
	}];

	$scope.restart = function (id) {
		data.restart(id).then(function (res) {

		}, function (err) {

		})
	};

	$scope.clearLog = function () {
		$scope.pio.logs = '';
		$scope.pio.data.length = 0;
	};

	data.logs().then(
		function (res) {
			$scope.logs = res.data;
			$scope.dataForLogs = true;
		},
		function (err) {

		});

	$scope.dtOptions = DTOptionsBuilder.newOptions()
		.withOption('processing', true)
		.withPaginationType('full_numbers');

	$scope.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3)
	];

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	$scope.appOpts = {
		segmentShowStroke:     true,
		segmentStrokeColor:    "#fff",
		segmentStrokeWidth:    2,
		percentageInnerCutout: 10, // This is 0 for Pie charts
		animationSteps:        100,
		animationEasing:       "easeOutBounce",
		animateRotate:         true,
		animateScale:          false
	};

	$scope.appData = [];
	$scope.totalAppMem = 0;
	function BuildAppData() {
		if ($scope.ao.appInfo.length > 0) {
			$scope.appData.length = 0;
			$scope.totalAppMem = 0;
			for (var i = 0; i < $scope.ao.appInfo.length; i++) {
				if ($scope.ao.appInfo[i].mem > 0) {
					$scope.totalAppMem += $scope.ao.appInfo[i].mem;
					var b = {
						value:     $scope.ao.appInfo[i].mem,
						label:     $scope.ao.appInfo[i].id,
						color:     colors.donut[i].color,
						highlight: colors.donut[i].highlight
					};
					$scope.appData.push(b);
				}
			}
		}
	}

	BuildAppData();

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

	var memPcnt = [
		0, 100, 0, 100, 0, 100, 0, 100, 0, 100,
		0, 100, 0, 100, 0, 100, 0, 100, 0, 100,
		0, 100, 0, 100, 0, 100, 0, 100, 0, 100];

	var cpuPcnt = [
		100, 0, 100, 0, 100, 0, 100, 0, 100, 0,
		100, 0, 100, 0, 100, 0, 100, 0, 100, 0,
		100, 0, 100, 0, 100, 0, 100, 0, 100, 0];

	$scope.lineOptions = {
		animation:               false,
		scaleShowGridLines:      true,
		scaleGridLineColor:      "rgba(0,0,0,.05)",
		scaleGridLineWidth:      1,
		bezierCurve:             true,
		bezierCurveTension:      0.4,
		pointDot:                true,
		pointDotRadius:          4,
		pointDotStrokeWidth:     1,
		pointHitDetectionRadius: 20,
		datasetStroke:           true,
		datasetStrokeWidth:      1,
		datasetFill:             true
	};

	$scope.lineData = {
		labels:   ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
			'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
			'21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
		datasets: [
			{
				label:                "Memory Percentage",
				fillColor:            "rgba(220,220,220,0.5)",
				strokeColor:          "rgba(220,220,220,1)",
				pointColor:           "rgba(220,220,220,1)",
				pointStrokeColor:     "#fff",
				pointHighlightFill:   "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data:                 memPcnt
			},
			{
				label:                "CPU Percentage",
				fillColor:            "rgba(98,203,49,0.5)",
				strokeColor:          "rgba(98,203,49,0.7)",
				pointColor:           "rgba(98,203,49,1)",
				pointStrokeColor:     "#fff",
				pointHighlightFill:   "#fff",
				pointHighlightStroke: "rgba(26,179,148,1)",
				data:                 cpuPcnt
			}
		]
	};

	function GetHistory() {
		data.history().then(
			function (res) {
				$scope.ao.history = res.data;
				HistoryChart();
			});
	}

	function HistoryChart() {
		memPcnt.length = 0;
		cpuPcnt.length = 0;

		for (var i = 0; i < $scope.ao.history.length; i++) {
			memPcnt.push($scope.ao.history[i].memPcnt);
			cpuPcnt.push($scope.ao.history[i].cpuPcnt);
		}

		$scope.lastUpdate = new Date();
		$scope.colWidth = 12;
	}

	function init() {
		if ($scope.ao.history && $scope.ao.history.length > 0) {
			HistoryChart();
		} else {
			$timeout(GetHistory, 5000);
		}
	}

	$timeout(init, 500);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	$scope.historyInterval = $interval(GetHistory, 60 * 1009);

	$scope.$on('$destroy', function () {
		$interval.cancel($scope.historyInterval);
	});
});