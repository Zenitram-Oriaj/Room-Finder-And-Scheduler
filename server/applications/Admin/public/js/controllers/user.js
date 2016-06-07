/**
 * Created by Jairo Martinez on 6/11/15.
 */
app.controller('UserCtrl', function ($scope, $state, auth, sweetAlert) {
	$scope.pswd = {
		email: '',
		crnt:  '',
		pass1: '',
		pass2: ''
	};

	$scope.chngPwd = function (isValid) {
		if (isValid) {
			$scope.pswd.email = $scope.ao.user.email;

			auth.updatePass($scope.pswd).then(
				function (res) {
					sweetAlert.swal({
							title:              "Update Completed",
							text:               "You have successfully updated your password",
							type:               "success",
							showCancelButton:   false,
							confirmButtonColor: "#62cb31",
							confirmButtonText:  "OK"
						},
						function () {
							$state.go('dashboard');
						});
				},
				function (err) {
					sweetAlert.swal({
						title:              "Error!",
						text:               err.data.message,
						type:               "error",
						showCancelButton:   false,
						confirmButtonColor: "#c0392b",
						confirmButtonText:  "Try Again!"
					});
				});
		}
	};

	$scope.update = function (isValid) {
		if (isValid) {
			auth.updateUser($scope.ao.user).then(
				function (res) {
					sweetAlert.swal({
							title:              "Update Completed",
							text:               "You have successfully updated your profile",
							type:               "success",
							showCancelButton:   false,
							confirmButtonColor: "#62cb31",
							confirmButtonText:  "OK"
						},
						function () {
							$state.go('dashboard');
						});
				},
				function (err) {
					sweetAlert.swal({
						title:              "Error!",
						text:               err.data.message,
						type:               "error",
						showCancelButton:   false,
						confirmButtonColor: "#c0392b",
						confirmButtonText:  "Try Again!"
					});
				});
		}
	};
});