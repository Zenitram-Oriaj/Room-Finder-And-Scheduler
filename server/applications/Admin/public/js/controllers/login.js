/**
 * Created by Jairo Martinez on 5/15/15.
 */
app.controller('LoginCtrl', function ($scope, $state, $timeout, auth) {
	$scope.failed = false;

	$scope.user = {
		email: '',
		pass:  ''
	};

	$scope.login = function (isValid) {
		if (isValid) {
			auth.login($scope.user).then(
				function (res) {
					$scope.failed = false;
					$scope.appLoggedIn(res.data.user, res.data.token);
					$('.splash').css('display', 'inline');
					$timeout(function(){
						$('.splash').css('display', 'none');
						$state.go('dashboard');
					},1000);
				},
				function (err) {
					$scope.failed = true;
					console.error(err);
				});
		}
	};

	$scope.$on('$destroy', function(){
		$scope.user = {
			email: '',
			pass:  ''
		};
	});
});