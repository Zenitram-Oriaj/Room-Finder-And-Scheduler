app.controller('AppCtrl', function ($rootScope, $scope, $state, $timeout, $interval, $sessionStorage, data, auth, socket, weather, browser, build, ao) {
	var initLocal = false;
	var initSession = false;
	$rootScope.accessLevel = 0;
	$scope.pio = {
		data: ['Local Logging Started At: ' + new Date()],
		logs: ''
	};
	$scope.ao = ao;

	if ($sessionStorage.ao) {
		$scope.ao = $sessionStorage.ao;
	} else {
		$sessionStorage.ao = $scope.ao;
	}

	$scope.wthr = {
		current: {
			temp:    0,
			icn:     "clear-day",
			icnSize: 75,
			color:   "gray"
		},
		today:   {
			high: 0,
			low:  0
		}
	};

	var geocoder = new google.maps.Geocoder();

	$scope.updateWeather = function () {
		var lat = '36.1215';
		var lgt = '-115.1739';

		if ($scope.ao.gateway.project && $scope.ao.gateway.project.location) {
			if ($scope.ao.gateway.project.location.lat && $scope.ao.gateway.project.location.log) {
				lat = $scope.ao.gateway.project.location.lat;
				lgt = $scope.ao.gateway.project.location.log;
			}
		}

		weather.forecast(lat, lgt).then(
			function (res) {
				console.info(res);
				$scope.wthr.current.tmp = Math.ceil(res.currently.temperature);
				$scope.wthr.current.icn = res.currently.icon;

				$scope.wthr.today.high = Math.ceil(res.daily.data[0].temperatureMax);
				$scope.wthr.today.low = Math.ceil(res.daily.data[0].temperatureMin);

				$scope.$apply();
			},
			function (err) {
				console.error(err);
			});
	};

	function setParams() {
		$scope.fullAddress = build.address($scope.ao.gateway.project.location);

		if (!$scope.ao.gateway.project.location.lat) {
			geocoder.geocode({'address': $scope.fullAddress}, function (res, sts) {
				if (sts == google.maps.GeocoderStatus.OK) {
					$scope.ao.gateway.project.location.lat = res[0].geometry.location.A.toString().substr(0, 8);
					$scope.ao.gateway.project.location.log = res[0].geometry.location.F.toString().substr(0, 8);
					$scope.ao.gateway.project.location.id = res[0].place_id;

					$scope.updateWeather();
				}
			});
		}
	}

	function init() {
		if (sessionStorage.token) {
			auth.getUser(sessionStorage.email).then(
				function (res) {
					$rootScope.appLoggedIn(res.data.user, null);
				},
				function (err) {

				});
		}
	}

	init();

	$rootScope.appLoggedIn = function (user, token) {
		$scope.ao.user = user;
		$rootScope.accessLevel = user.accessLevel;

		if (token != undefined || token != null) {
			sessionStorage.setItem('token', token);
		}

		sessionStorage.setItem('fullName', user.firstName + ' ' + user.lastName);
		sessionStorage.setItem('email', user.email);
	};

	$rootScope.appLoggedOut = function () {
		$scope.ao.user = {
			email:       '',
			password:    '',
			firstName:   '',
			lastName:    '',
			accessLevel: 0,
			phone:       '',
			title:       '',
			admin:       false,
			token:       ''
		};

		sessionStorage.removeItem('token');
		sessionStorage.removeItem('fullName');
		sessionStorage.removeItem('email');
	};

	$scope.ao.browser = browser.detect();

	function GetMultiIntervalData() {

		data.events().then(
			function (res) {
				$scope.ao.events.length = 0;
				$scope.ao.events = res.data;
			});

		data.info().then(
			function (res) {
				$scope.ao.info.length = 0;
				$scope.ao.info = res.data
			});

		$scope.ao.updatedAt = new Date();
	}

	function Collect() {
		GetMultiIntervalData();

		data.types('ws').then(
			function (res) {
				$scope.ao.typeList = res.data;
			});

		data.collect('gw').then(
			function (res) {
				$scope.ao.gateway = res.data;
				setParams();
			});

		data.collect('ct').then(
			function (res) {
				$scope.ao.controllers = res.data;
			});

		data.collect('ws').then(
			function (res) {
				$scope.ao.workspaces = res.data;
			});

		data.collect('ds').then(
			function (res) {
				$scope.ao.discovers = res.data;
			});

		data.collect('wf').then(
			function (res) {
				$scope.ao.wayfinders = res.data;
			});

		data.collect('tp').then(
			function (res) {
				$scope.ao.touchpanels = res.data;
			});

		data.history().then(
			function (res) {
				$scope.ao.history = res.data;
			});

		$scope.updateWeather();
	}

	$scope.$on('reload', function () {
		Collect();
	});

	Collect();

	var datInterval2 = $interval(GetMultiIntervalData, 5 * 60 * 1000);

	$scope.$on('$destroy', function () {
		$interval.cancel(datInterval2);
	});

// For iCheck purpose only
	//$scope.checkOne = true;
	//$scope.oneAtATime = true;

	$scope.stanimation = 'bounceIn';
	$scope.runIt = true;
	$scope.runAnimation = function () {
		$scope.runIt = false;
		$timeout(function () {
			$scope.runIt = true;
		}, 100)
	};

	// Socket Events
	/////////////////////////////////////////////////////////////////////////

	socket.on('connect', function () {
		socket.emit('browser', $scope.ao.browser);
	});

	socket.on('disconnect', function (err) {
	});

	socket.on('error', function (err) {
		console.error(err);
	});

	socket.on('info', function (res) {
		$scope.ao.appInfo = res.data;
		$rootScope.$broadcast('appInfoUpdate');
	});

	/////////////////////////////////////////////////////////////////////////

	/**
	 * Scope Watch - ao
	 */
	$scope.$watch('ao', function (n, o) {
		if (initSession) {
			$sessionStorage.ao = $scope.ao;
			$scope.$emit('update');
		} else {
			initSession = true;
		}
	}, true);
});
