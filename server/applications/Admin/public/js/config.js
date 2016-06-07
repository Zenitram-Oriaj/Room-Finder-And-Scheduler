/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

function configState($stateProvider, $urlRouterProvider, $compileProvider) {

	// Optimize load start with remove binding information inside the DOM element
	$compileProvider.debugInfoEnabled(true);

	// Set default state
	$urlRouterProvider.otherwise("/dashboard");
	$stateProvider

		// Login
		//////////////////////////////////////////////////////
		.state('login', {
			url:         "/login",
			templateUrl: "views/login.html",
			controller:  "LoginCtrl",
			access:      {
				requiredLogin: false,
				minLevel:      0
			},
			data:        {
				pageTitle:    'Login',
				specialClass: 'blank'
			}
		})

		// Register
		//////////////////////////////////////////////////////
		.state('register', {
			url:         "/register",
			templateUrl: "views/register.html",
			controller:  "RegisterCtrl",
			access:      {
				requiredLogin: false,
				minLevel:      0
			},
			data:        {
				pageTitle:    'Register',
				specialClass: 'blank'
			}
		})

		// Not Authorized
		//////////////////////////////////////////////////////
		.state('notAuthorized', {
			url:         "/notAuthorized",
			templateUrl: "views/notAuthorized.html",
			access:      {
				requiredLogin: false,
				minLevel:      0
			},
			data:        {
				pageTitle:    'Not Authorized',
				specialClass: 'blank'
			}
		})

		// Lock
		//////////////////////////////////////////////////////
		.state('lock', {
			url:         "/lock",
			templateUrl: "views/lock.html",
			controller:  "LockCtrl",
			access:      {
				requiredLogin: false,
				minLevel:      0
			},
			data:        {
				pageTitle:    'Server Offline',
				specialClass: 'blank'
			}
		})

		// User
		//////////////////////////////////////////////////////
		.state('user', {
			abstract:    true,
			url:         "/id",
			controller:  "UserCtrl",
			templateUrl: "views/common/content.html",
			data:        {
				pageTitle: 'User'
			}
		})
		.state('user.info', {
			url:         "/info",
			templateUrl: "views/user/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      1
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'User Profile And History'
			}
		})
		.state('user.pass', {
			url:         "/pass",
			templateUrl: "views/user/pass.html",
			access:      {
				requiredLogin: true,
				minLevel:      1
			},
			data:        {
				pageTitle: 'Password',
				pageDesc:  'Update Your Password'
			}
		})
		.state('user.users', {
			url:         "/users",
			templateUrl: "views/user/users.html",
			access:      {
				requiredLogin: true,
				minLevel:      4
			},
			data:        {
				pageTitle: 'Manage',
				pageDesc:  'View And Update System Users'
			}
		})
		.state('user.admin', {
			url:         "/admin",
			templateUrl: "views/user/admin.html",
			access:      {
				requiredLogin: true,
				minLevel:      4
			},
			data:        {
				pageTitle: 'Administration',
				pageDesc:  ''
			}
		})

		// Dashboard
		//////////////////////////////////////////////////////
		.state('dashboard', {
			url:         "/dashboard",
			templateUrl: "views/dashboard.html",
			access:      {
				requiredLogin: true,
				minLevel:      1
			},
			data:        {
				pageTitle: 'Dashboard'
			}
		})

		// Analytics
		//////////////////////////////////////////////////////
		.state('analytics', {
			url:         "/analytics",
			templateUrl: "views/analytics.html",
			controller:  "AnalyticsCtrl",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Analytics'
			}
		})

		// Gateway
		//////////////////////////////////////////////////////
		.state('gateway', {
			abstract:    true,
			url:         "/gw",
			templateUrl: "views/common/content.html",
			controller:  "GatewayCtrl",
			data:        {
				pageTitle: 'Gateway'
			}
		})
		.state('gateway.info', {
			url:         "/info",
			templateUrl: "views/gateway/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'Overview Of The Gateway Server'
			}
		})
		.state('gateway.config', {
			url:         "/config",
			templateUrl: "views/gateway/config.html",
			access:      {
				requiredLogin: true,
				minLevel:      4
			},
			data:        {
				pageTitle: 'Configuration',
				pageDesc:  'Setup System Parameters'
			}
		})

		// Workspaces
		//////////////////////////////////////////////////////
		.state('workspaces', {
			abstract:    true,
			url:         "/ws",
			controller:  "WorkspaceCtrl",
			templateUrl: "views/common/content.html",
			data:        {
				pageTitle: 'Workspaces'
			}
		})
		.state('workspaces.info', {
			url:         "/info",
			templateUrl: "views/workspaces/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'Overview Of Workspaces'
			}
		})
		.state('workspaces.history', {
			url:         "/history",
			templateUrl: "views/workspaces/history.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'History',
				pageDesc:  'Overview Of Workspace Activity'
			}
		})

		// Controllers
		//////////////////////////////////////////////////////
		.state('controllers', {
			abstract:    true,
			url:         "/ct",
			templateUrl: "views/common/content.html",
			controller:  "ControllerCtrl",
			data:        {
				pageTitle: 'Controllers'
			}
		})
		.state('controllers.info', {
			url:         "/info",
			templateUrl: "views/controllers/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'Overview Of Controllers'
			}
		})
		.state('controllers.add', {
			url:         "/add",
			templateUrl: "views/controllers/add.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Install',
				pageDesc:  'Add New Controller'
			}
		})

		// WayFinders
		//////////////////////////////////////////////////////
		.state('wayfinders', {
			abstract:    true,
			url:         "/wf",
			templateUrl: "views/common/content.html",
			controller:  "WayFinderCtrl",
			data:        {
				pageTitle: 'WayFinders'
			}
		})
		.state('wayfinders.info', {
			url:         "/info",
			templateUrl: "views/wayfinders/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'Overview Of WayFinders'
			}
		})
		.state('wayfinders.add', {
			url:         "/add",
			templateUrl: "views/wayfinders/add.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Install',
				pageDesc:  'Add New WayFinder'
			}
		})
		.state('wayfinders.custom', {
			url:         "/custom",
			templateUrl: "views/wayfinders/custom.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Customize',
				pageDesc:  'Change The Logo And Background'
			}
		})

		// TouchPanels
		//////////////////////////////////////////////////////
		.state('touchpanels', {
			abstract:    true,
			url:         "/tp",
			templateUrl: "views/common/content.html",
			controller:  "TouchPanelCtrl",
			data:        {
				pageTitle: 'Touch Panels'
			}
		})
		.state('touchpanels.info', {
			url:         "/info",
			templateUrl: "views/touchpanels/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'Overview Of Touch Panels'
			}
		})
		.state('touchpanels.add', {
			url:         "/add",
			templateUrl: "views/touchpanels/add.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Install',
				pageDesc:  'Add New Touch Panel'
			}
		})
		.state('touchpanels.custom', {
			url:         "/custom",
			templateUrl: "views/touchpanels/custom.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Customize',
				pageDesc:  'Change The Logo And Background'
			}
		})

		// Server
		//////////////////////////////////////////////////////
		.state('server', {
			abstract:    true,
			url:         "/sv",
			templateUrl: "views/common/content.html",
			controller:  "ServerCtrl",
			data:        {
				pageTitle: 'Server'
			}
		})
		.state('server.info', {
			url:         "/info",
			templateUrl: "views/server/info.html",
			access:      {
				requiredLogin: true,
				minLevel:      2
			},
			data:        {
				pageTitle: 'Information',
				pageDesc:  'Overview Of Server'
			}
		})
		.state('server.logs', {
			url:         "/logs",
			templateUrl: "views/server/logs.html",
			access:      {
				requiredLogin: true,
				minLevel:      3
			},
			data:        {
				pageTitle: 'Logs',
				pageDesc:  'Server Events'
			}
		})
		.state('server.maintenance', {
			url:         "/maintenance",
			templateUrl: "views/server/maintenance.html",
			access:      {
				requiredLogin: true,
				minLevel:      4
			},
			data:        {
				pageTitle: 'Maintenance',
				pageDesc:  'Server Controls'
			}
		});
}

app.config(configState);

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});

app.run(function ($rootScope, $location, $state, auth) {
	$rootScope.$state = $state;
	$rootScope.$on("$stateChangeStart", function (event, next) {
		if (next.access.requiredLogin) {
			if (sessionStorage.token) {
				var tk = {
					token: sessionStorage.token,
					email: sessionStorage.email
				};
				auth.challenge(tk).then(
					function (res) {
						$rootScope.appLoggedIn(res.data.user, res.data.token);
						if ($rootScope.accessLevel < next.access.minLevel) {
							$location.path("/notAuthorized");
						}
					},
					function (err) {
						console.error(err);
						$rootScope.userloggedin = false;
						$location.path("/login");
					});
			} else {
				$location.path("/login");
			}
		}
	});
});