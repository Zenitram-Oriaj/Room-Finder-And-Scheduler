/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.controller('AppCtrl', function ($scope, $modal, $window, $localStorage, $timeout, $interval, $sessionStorage, ao, Fullscreen, info, _, workspace, schedule, browser, socket, auth, data, sweetAlert) {
	var initLocal = false;
	var initSession = false;
	var appStart = new Date();

	$scope.sidebar = false;
	$scope.loaded = false;
	$scope.resInfo = [];
	$scope.workspaces = [];
	$scope.reservations = [];
	$scope.bgImg = {};
	$scope.title = 'Agile Office - WayFinder';
	$scope.ao = ao;

	$scope.session = {
		login:   false,
		email:   '',
		token:   '',
		locList: []
	};

	function register() {
		data.register($scope.ao).then(
			function (res) {
			},
			function (err) {
			});
	}

	function heartbeat() {
		if ($scope.ao.turnkey) {
			var dt = new Date();

			var t = dt - appStart;
			$scope.ao.uptime = Math.ceil((t / 1000) / 60);

			data.heartbeat($scope.ao).then(
				function (res) {
				},
				function (err) {
					console.error(err);
				});
		}

	}

	var init = function (p) {
		$scope.ao.dflt.floorId = p.floorId || 'GBL';
		$scope.ao.dflt.locationId = p.locationId || 'GBL';

		$scope.ao.crnt = $scope.ao.dflt;

		$scope.ao.browser = browser.detect();
		$scope.ao.os = browser.os();
	};

	$scope.run = function () {
		appStart = new Date();
		var p = browser.params();

		if ($localStorage.ao) {
			$scope.ao = $localStorage.ao;
		} else {
			init(p);
			$localStorage.ao = $scope.ao;
		}

		if (p.locationId) {
			$scope.ao.crnt.locationId = p.locationId;
			$scope.ao.crnt.floorId = p.floorId;

			info.floorList(p.locationId).then(
				function (res) {
					$scope.ao.location = res.data;
					$scope.ao.bgColor = $scope.ao.location.css.color;
					$scope.cssBg = {
						'background-color': $scope.ao.bgColor,
						'background-image': 'url(./img/' + $scope.ao.crnt.locationId + '/bg.jpg)'
					};
					$localStorage.ao = $scope.ao;
				},
				function (err) {
					console.error(err);
				});
		} else {
			$scope.ao.crnt.locationId = $scope.ao.dflt.locationId;
			$scope.ao.crnt.floorId = $scope.ao.dflt.floorId;

			var a = $scope.ao.crnt.locationId;
			var b = $scope.ao.crnt.floorId;

			$window.location.href = $window.location.origin + '/?locationId=' + a + '&floorId=' + b;
		}

		if ($sessionStorage.ao) {
			$scope.session = $sessionStorage.ao;
		} else {
			$sessionStorage.ao = $scope.session;
		}

		data.myIP().then(
			function (res) {
				$scope.ao.ip = res.data.ip;
				data.getUuid($scope.ao).then(
					function (res) {
						$scope.ao.uuid = res.data.uuid;
						$scope.ao.turnkey = true;

						$interval(heartbeat, 5 * 60 * 1000);
						$timeout(register, 30 * 1000);
					},
					function (err) {
						console.error(err);
					});
			},
			function (err) {
				console.error(err);
			});

		if ($scope.session.locList.length == 0) {
			info.locationList().then(
				function (res) {
					$scope.session.locList = res.data;
					$sessionStorage.ao = $scope.session;
				},
				function (err) {
					console.error(err);
				});
		}

		$scope.ao.uptime = 0;
		$scope.ao.screen = browser.screen();

		$scope.cssBg = {
			'background-color': $scope.ao.bgColor,
			'background-image': 'url(./img/' + $scope.ao.crnt.locationId + '/bg.jpg)'
		};

		if ($scope.ao.crnt.floorId == 'GBL') $scope.sidebar = true;

		workspace.collect($scope.ao.crnt.locationId, $scope.ao.crnt.floorId).then(
			function (res) {
				$scope.workspaces = res.data;
			},
			function (err) {
				console.log(err);
			});

		$timeout(function () {
			$scope.loaded = true;
		}, 1000)
	};

	$scope.run();

	$scope.enableFullscreen = function () {
		if (Fullscreen.isEnabled()) Fullscreen.cancel();
		else Fullscreen.all();
	};

	/**
	 * Socket Events
	 *
	 */

	socket.on('connect', function () {
		if ($scope.ao.turnkey) {

		}
	});

	socket.on('disconnect', function (res) {
		console.error(res);
	});

	socket.on('error', function (err) {
		console.error(err);
	});

	socket.on('refresh', function (obj) {
		var a = $scope.ao.crnt.locationId;
		var b = $scope.ao.crnt.floorId;

		$window.location.href = $window.location.origin + '/?locationId=' + a + '&floorId=' + b;
	});

	// Modal Controls
	///////////////////////////////////////////////////////////////////////////////////

	$scope.processReq = function (ws, rs) {

		var obj = {
			pass: false,
			type: '',
			room: ws,
			msg:  ''
		};

		console.log(rs);

		if (rs.create) {
			schedule.create(rs).then(
				function (res) {
					var rd = res.data.SubmitReservationResult;
					console.log(res.data);

					if (rd.IsValid == 'true' || rd.IsValid == true) {
						obj.pass = true;
						obj.type = 'Created';
					} else {
						obj.pass = false;
						if (rd.AllChildBrokenBusinessRules.BrokenRuleData instanceof Array) {
							obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData[0].Description;
						} else {
							obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;
						}

					}
					$scope.resultsModal(obj);
				},
				function (err) {
					console.log(err);
				});
		}
		else if (rs.change) {
			schedule.update(rs).then(
				function (res) {
					var rd = res.data.SubmitReservationResult;
					console.info(res.data);

					if (rd.IsValid == 'true' || rd.IsValid == true) {
						obj.pass = true;
						obj.type = 'Updated';
					} else {
						obj.pass = false;
						obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;
					}
					$scope.resultsModal(obj);
				},
				function (err) {
					console.log(err);
				});
		}
		else if (rs.remove) {
			schedule.remove(rs).then(
				function (res) {
					var rd = res.data.DeleteReservationResult;
					console.log(res.data);

					if (rd.IsValid == 'true' || rd.IsValid == true) {
						obj.pass = true;
						obj.type = 'Removed';
					} else {
						obj.pass = false;
						obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;
					}
					$scope.resultsModal(obj);
				},
				function (err) {
					console.log(err);
				});
		} else {

		}
	};

	$scope.reservationsModal = function (ws, reservations) {
		var mi = $modal.open({
			templateUrl: 'views/modals/modalReservations.html',
			controller:  'ModalReservationCtrl',
			size:        'lg',
			resolve:     {
				reservations: function () {
					return reservations;
				},
				ws:           function () {
					return ws;
				}
			}
		});

		mi.result.then(
			function (reqWs) {
				if (reqWs.change) {
					$scope.updateModal(reqWs);
				} else {
					$scope.localResModal(reqWs);
				}

			},
			function () {

			});
	};

	$scope.updateModal = function (ws) {
		var mi = $modal.open({
			templateUrl: 'views/modals/modalUpdateRes.html',
			controller:  'ModalUpdateResCtrl',
			size:        'lg',
			resolve:     {
				ws: function () {
					return ws;
				}
			}
		});

		mi.result.then(
			function (rs) {
				$scope.processReq(ws, rs);
			},
			function () {

			});
	};

	$scope.localResModal = function (ws) {

		schedule.resObj().then(
			function (res) {
				var obj = res.data;

				var mi = $modal.open({
					templateUrl: 'views/modals/modalLocalRes.html',
					controller:  'ModalLocalReserveCtrl',
					size:        'lg',
					resolve:     {
						ws:  function () {
							return ws;
						},
						obj: function () {
							return obj;
						}
					}
				});

				mi.result.then(
					function (rs) {
						$scope.processReq(ws, rs);
					},
					function () {

					});
			},
			function (err) {
				console.log(err);
			});
	};

	$scope.resultsModal = function (obj) {

		var mi = $modal.open({
			templateUrl: 'views/modals/modalResults.html',
			controller:  'ModalResultsCtrl',
			resolve:     {
				obj: function () {
					return obj;
				}
			}
		});

		mi.result.then(
			function () {

			},
			function () {

			});
	};

	$scope.infoReq = function (id) {
		if (id < 10) {
			id = '00' + id;
		}
		else if (id < 100) {
			id = '0' + id;
		} else {
			id = id.toString();
		}

		var uuid = $scope.ao.crnt.locationId + ':' + $scope.ao.crnt.floorId + ':' + id.toString();

		var ws = _.findWhere($scope.workspaces, {uuid: uuid});

		if (ws.reservable) {
			schedule.getWsSchd(ws.reserveId).then(
				function (res) {
					$scope.reservationsModal(ws, res.data);
				},
				function (err) {

				});
		} else {
			$scope.reservationsModal(ws, null);
		}
	};

	// Login
	///////////////////////////////////////////////////////////////////////////////////

	/**
	 * loginModal()
	 */
	$scope.loginModal = function () {
		var mi = $modal.open({
			templateUrl: 'views/modals/modalLogin.html',
			controller:  'ModalLoginCtrl',
			size:        'sm'
		});

		mi.result.then(
			function (creds) {
				auth.login(creds).then(
					function (res) {
						$scope.session.email = creds.email;
						$scope.session.token = res.data.data;
						$scope.session.login = true;
						$timeout(function () {
							$scope.configModal();
						}, 500)
					},
					function (err) {
						sweetAlert.swal({
							title: "Error",
							text:  err.data.message,
							type:  "error"
						});
					});
			},
			function () {

			});
	};

	// Configure
	///////////////////////////////////////////////////////////////////////////////////

	$scope.configModal = function () {
		var ao = $.extend({}, $scope.ao);
		var mi = $modal.open({
			templateUrl: 'views/modals/modalConfig.html',
			controller:  'ModalConfigCtrl',
			resolve:     {
				ao:  function () {
					return ao;
				},
				lcs: function () {
					return $scope.session.locList;
				}
			}
		});

		mi.result.then(
			function (ao) {
				if (ao.clear) {
					$localStorage.$reset();
					$sessionStorage.$reset();
					$window.location.href = $window.location.origin;
				} else {
					$scope.ao = ao;
					if ($scope.ao.turnkey) {
						register();
					}
				}
			},
			function () {
			});
	};

	/**
	 * Side Bar Controls
	 */

	$scope.configure = function () {
		$scope.sidebar = false;
		if ($scope.session.login && $scope.session.token.length > 0) {
			var user = {
				email: $scope.session.email,
				token: $scope.session.token
			};
			auth.challenge(user).then(
				function (res) {
					$scope.configModal();
				},
				function (err) {
					sweetAlert.swal({
						title: "Error",
						text:  err.data.message,
						type:  "error"
					});
				});

		} else {
			$scope.loginModal();
		}
	};

	$scope.refresh = function () {

	};

	$scope.hideSidebar = function () {
		$scope.sidebar = false;
	};

	$scope.toggleSidebar = function () {
		$scope.sidebar = !$scope.sidebar;
	}

	/**
	 * Scope Watch - ao
	 */

	$scope.$watch('ao.updatedAt', function (nw, ol) {
		if (initLocal) {
			$scope.ao.updatedAt = new Date();
			$localStorage.ao = $scope.ao;
		} else {
			initLocal = true;
		}
	});

	$scope.$watch('session.updatedAt', function (nw, ol) {
		if (initSession) {
			$sessionStorage.ao = $scope.ao;
			console.info('Saving Session Storage');
		} else {
			initSession = true;
		}

	});
});

