/**
 * Created by Jairo Martinez on 5/19/15.
 */
app.controller('GatewayCtrl', function ($scope, $state, Upload, data, build) {
	$scope.manualSlct = false;
	$scope.tzs = [];
	$scope.fullAddress = '';

	function setTzSelect() {
		for (var i = 0; i < $scope.tzs.length; i++) {
			if ($scope.tzs[i].value == $scope.ao.gateway.timezone.value) {
				$scope.ao.gateway.timezone = $scope.tzs[i];
			}
		}
	}

	$scope.location = 'CGO';

	$scope.slctParms = [
		{label: 'Auto', id: 'A'},
		{label: 'Manual', id: 'M'}
	];

	$scope.slctRoles = [
		{label: 'Primary', id: 'primary'},
		{label: 'Secondary', id: 'secondary'}
	];

	var a = parseFloat($scope.ao.gateway.project.location.lat);
	var b = parseFloat($scope.ao.gateway.project.location.log);

	$scope.mapOptions = {
		zoom:      15,
		center:    new google.maps.LatLng(a, b),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	$scope.upload = function (files) {
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				Upload.upload({
					url: 'api/uploads',
					fields: {'location': $scope.location},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
				}).success(function (data, status, headers, cfg) {
					console.log('file ' + cfg.file.name + ' uploaded. Response: ');
					console.log(data);
				});
			}
		}
	};

	$scope.updateRole = function () {
		$scope.ao.gateway.server.isPri = ($scope.ao.gateway.server.role == 'primary');
	};

	$scope.updateMode = function () {
		$scope.manualSlct = ($scope.ao.gateway.network.mode == 'M');
	};

	$scope.timeZones = function () {
		data.timeZones().then(
			function (res) {
				$scope.tzs = res.data;
				setTzSelect();
			},
			function (err) {
				console.error(err);
			});
	};

	$scope.slctTimeZone = function () {
	};

	$scope.update = function () {
		$scope.ao.gateway.restart = true;
		data.update('gw', $scope.ao.gateway).then(
			function (res) {
				console.log(res);
			},
			function (err) {
				alert(err.data.message);
			});

		$state.go('gateway.info');
	};

	$scope.init = function () {
		$scope.fullAddress = build.address($scope.ao.gateway.project.location);
		$scope.timeZones();
		$scope.updateMode();
	};
	$scope.init();

});