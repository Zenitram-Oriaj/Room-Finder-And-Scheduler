// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('app', [
	'ionic',
	'ngCordova',
	'ngStorage',
	'ao.timepicker'
]);

app.constant("Modals", {
	"Setting": 1,
	"Reserve": 2,
	"ExtMeet": 3,
	"EndMeet": 4,
	"ScrnSvr": 5
});

/*
 app.config(function ($httpProvider) {

 $httpProvider.defaults.useXDomain = true;
 $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
 $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
 $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Access-Control-Allow-Headers, Authorization';

 delete $httpProvider.defaults.headers.common['X-Requested-With'];

 console.log($httpProvider.defaults);
 });
*/

app.controller('AppCtrl', function ($scope, $window, $timeout, $interval, $localStorage, ao, carousel, modal, reservation, browser, data, sweetAlert) {

	var appStart = new Date();

	$scope.TotalMeetings = 0;
	$scope.ActiveMeeting = -1;
	$scope.events = [];
	$scope.refMeeting = {};
	$scope.jcl = {};
	$scope.live = 0;
	$scope.modalId = 0;
	$scope.res = {};

	$scope.hstep = 1;
	$scope.mstep1 = 1;
	$scope.mstep2 = 15;

	$scope.options = {
		hstep: [1, 2, 3],
		mstep: [1, 5, 10, 15, 25, 30]
	};

	$scope.ismeridian = true;

	$scope.btns = {
		btn01: document.getElementById('btn01'),
		btn02: document.getElementById('btn02'),
		btn03: document.getElementById('btn03')
	};

	if ($localStorage.ao) {
		$scope.ao = $localStorage.ao;
	} else {
		$scope.ao = ao;
		$scope.ao.screen = browser.screen();
		$scope.ao.browser = browser.detect();
		$scope.ao.os = browser.os();
	}

	if ($scope.ao.scrnSvrTimer) {
		$scope.ao.scrnSvrTimer = 5 * 60 * 1000;
	}

	if($scope.ao.uuid == 'A1B2C3D4E5F6') $scope.ao.uuid = '';

	$scope.ao.uuid = $scope.ao.uuid.toUpperCase();
	$scope.ao.uptime = 0;
	$scope.ao.type = 'TPS';
	$scope.ao.commErr = false;
	$scope.ao.info = $scope.info;

	if($scope.ao.refId) $scope.ao.reserveId = $scope.ao.refId;

	data.myIP($scope.ao.url).then(
		function (res) {
			$scope.ao.ip = res.data.ip;
		});

	var scrnSvrTimer = $scope.ao.scrnSvrTimer;

	$scope.resetCfg = function () {
		$localStorage.$reset();
		$scope.ao = ao;
		$scope.ao.screen = browser.screen();
		$scope.ao.browser = browser.detect();
		$scope.ao.os = browser.os();
	};

	/**
	 * Handle Document Touch
	 *
	 */

	$scope.DocClick = function () {
		$scope.resetTimer();
		$scope.resetScreenSvr();
	};

	// SIDE BUTTON BAR METHODS
	/////////////////////////////////////////

	$scope.inactive = function () {
		$scope.btns.btn01.text = "RESERVE ROOM";
		$scope.btns.btn02.text = "-";
		$scope.btns.btn03.text = "-";
		$scope.btns.btn01.hidden = false;
		$scope.btns.btn02.hidden = true;
		$scope.btns.btn03.hidden = true;
	};

	$scope.active = function () {
		$scope.btns.btn01.text = "RESERVE ROOM";
		$scope.btns.btn02.text = "EXTEND MEETING";
		$scope.btns.btn03.text = "END MEETING";
		$scope.btns.btn01.hidden = false;
		$scope.btns.btn02.hidden = false;
		$scope.btns.btn03.hidden = false;
	};

	$scope.inactive();

	// CAROUSEL METHODS
	/////////////////////////////////////////

	var BuildCarousel = function () {
		console.log('Build Carousel');
		$scope.ao.commErr = false;

		data.collect($scope.ao.reserveId, $scope.ao.url).then(
			function(res){
				console.log('Data Collected Success');
				console.log(res.data);

				$scope.ActiveMeeting = 0;
				$scope.TotalMeetings = 0;
				$scope.events.length = 0;
				$scope.reservations = res.data;


				if(res.data && res.data.length > 0){
					carousel.build($scope);
				} else {
					carousel.empty($scope);
				}

			},
			function(err){
				console.log('Data Collected Success');
				console.error(err);
				$scope.ao.commErr = true;
			});
	};

	$timeout(BuildCarousel, 4 * 1000);
	$scope.updateSchedule = $interval(BuildCarousel, 60 * 1000);

	$scope.resetTimer = function () {
		$interval.cancel($scope.updateSchedule);
		$scope.updateSchedule = $interval(BuildCarousel, 60 * 1000);
	};

	$scope.jclPrev = function () {
		$scope.jcl.jcarousel('scroll', '-=1');
	};

	$scope.jclNext = function () {
		$scope.jcl.jcarousel('scroll', '+=1');
	};

	$scope.onDragRight = function () {
		$scope.jclNext();
	};

	$scope.onDragLeft = function () {
		$scope.jclPrev();
	};

	// Register
	/////////////////////////////////////////

	var workspace = function(i){
		data.info($scope.ao.reserveId, $scope.ao.url).then(
			function (res) {
				$scope.ao.workspace.uuid = res.data.uuid;
				$scope.ao.workspace.id = res.data.id;
				$scope.ao.workspace.desc = res.data.description;
				$scope.ao.allowLocal = res.data.allowLocal;
				$scope.ao.name = res.data.name;
				$scope.ao.tzs.dst = res.data.dst;
				$scope.ao.tzs.tzOffset = res.data.tzOffset;
				$scope.ao.tzs.timeZoneId = res.data.timeZoneId;
				$scope.ao.dflt.locationId = res.data.locationId;
				$scope.ao.dflt.floorId = res.data.floorId;
				if(i) update();
			});
	};

	var register = function () {
		data.register($scope.ao.url, $scope.ao).then(
			function (res) {
				workspace(false);
			},
			function (err) {
				console.error(err);
			});
	};

	var update = function () {
		data.tpUpdate($scope.ao.url, $scope.ao).then(
			function (res) {
				console.info(res);
			},
			function (err) {
				console.error(err);
			});
	};

	var heartbeat = function () {

		var dt = new Date();

		var t = dt - appStart;
		$scope.ao.uptime = Math.ceil((t / 1000) / 60);

		data.heartbeat($scope.ao.url, $scope.ao).then(
			function (res) {
				console.info(res);
				workspace(false);
			},
			function (err) {
				console.error(err);
			});
	};

	$interval(heartbeat, 5 * 60 * 1000);
	$timeout(register, 10 * 1000);

	// Screen Saver
	/////////////////////////////////////////

	function ScreenSaver() {
		if ($scope.ao.enableScrnSvr) {
			$scope.showModal(5);
		}
	}

	$scope.screenSvr = $timeout(ScreenSaver, scrnSvrTimer);

	$scope.resetScreenSvr = function () {
		$timeout.cancel($scope.screenSvr);
		$scope.screenSvr = $timeout(ScreenSaver, scrnSvrTimer);
	};

	// Modals
	/////////////////////////////////////////

	$scope.showModal = function (id) {
		$scope.modalId = id;
		if (id == 2) {
			$scope.buildRes();
		} else {
			modal.show(id, $scope);
		}
	};

	$scope.hideModal = function (id) {
		modal.hide(id, $scope);

		switch (id) {
			case 1:
			case 7: {
				if($scope.obj && $scope.obj.pass == true) {
					setTimeout(function(){
						BuildCarousel();
						$scope.showModal(9);
					}, 500);
				}
				break;
			}
			default:
			{
				break;
			}
		}

		if (id == 1) {
			workspace(true);
		}
		else if (id == 5) $scope.resetScreenSvr();
	};

	// Reservation Methods
	/////////////////////////////////////////

	$scope.errorInfo = function () {
		sweetAlert.swal({
			title: "Communication Error",
			text:  "Unable to connect to server",
			type:  "error"
		});
	};

	$scope.refresh = function () {
		modal.show(9, $scope);
		BuildCarousel();
	};

	$scope.widgetClick = function (val) {
		$scope.refMeeting = $scope.events[(val - 1)];
		$scope.showModal(6, $scope);
	};

	$scope.buildRes = function () {
		reservation.build($scope);
	};

	$scope.changeStart = function () {
		var t = new Date($scope.res.startTime);
		t.setMinutes(t.getMinutes() + $scope.minutes);
		$scope.res.stopTime = t;
	};

	$scope.incrementMinutes = function () {
		if ($scope.minutes < 120) {
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
		var t = new Date($scope.res.startTime);
		$scope.res.stopTime = t.setMinutes($scope.res.startTime.getMinutes() + $scope.minutes);
	};

	$scope.submitRes = function () {
		reservation.create($scope);
	};

	$scope.updateRes = function () {
		reservation.update($scope);
	};

	$scope.extMeeting = function () {
		$scope.res = $scope.events[($scope.ActiveMeeting - 1)];
		reservation.extend($scope);
	};

	$scope.endMeeting = function () {
		$scope.res = $scope.events[($scope.ActiveMeeting - 1)];
		reservation.end($scope);
	};

	$scope.editReservation = function () {
		reservation.edit($scope);
	};

	$scope.delReservation = function () {
		reservation.remove($scope);
	};

	//
	//////////////////////////////////

	$scope.$watch('ao', function () {
		$scope.ao.updatedAt = new Date();
		$localStorage.ao = $scope.ao;
	});
});

app.run(function ($rootScope, $ionicPlatform, $cordovaStatusbar, $cordovaSplashscreen) {
	$ionicPlatform.ready(function () {
		$cordovaStatusbar.style(2);
		$cordovaStatusbar.hide();

		setTimeout(function () {
			$cordovaSplashscreen.hide()
		}, 3000);

		$ionicPlatform.registerBackButtonAction(function (event) {
			if ($state.current.name == "app.home") {
				navigator.app.exitApp();
			}
			else {
				navigator.app.backHistory();
			}
		}, 100);

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}

		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

	});
});
