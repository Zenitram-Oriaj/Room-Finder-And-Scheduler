/**
 * Created by Jairo Martinez on 6/10/15.
 */
app.controller('RegisterCtrl', function ($scope, $modal, $state, sweetAlert ,auth) {
	$scope.register = {
		email:     '',
		pass1:     '',
		pass2:     '',
		password:  '',
		firstName: '',
		lastName:  '',
		title:     '',
		phone:     '',
		agree:     false
	};

	$scope.clear = function () {
		$scope.register = {
			email:     '',
			pass1:     '',
			pass2:     '',
			password:  '',
			firstName: '',
			lastName:  '',
			title:     '',
			phone:     '',
			agree:     false
		};
	};

	$scope.reg = function (isValid) {
		if (isValid) {
			$scope.register.password = $scope.register.pass1;
			auth.register($scope.register).then(
				function (res) {
					sweetAlert.swal({
							title: "Registration Completed",
							text: "You have successfully created an account. Press Ok to login now",
							type: "success",
							showCancelButton: false,
							confirmButtonColor: "#62cb31",
							confirmButtonText: "OK"
						},
						function () {
							$state.go('login');
						});
				},
				function (err) {
					sweetAlert.swal({
						title: "Error!",
						text: err.data.message,
						type: "error",
						showCancelButton: false,
						confirmButtonColor: "#c0392b",
						confirmButtonText: "Try Again!"
					});
				});
		}

	};


	$scope.terms = function () {
		var winClass = "hmodal-warning2";

		var mi = $modal.open({
			templateUrl: 'views/modals/terms.html',
			controller:  TermsModalCtrl,
			windowClass: winClass
		});
	};
});

function TermsModalCtrl($scope, $modalInstance) {
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}