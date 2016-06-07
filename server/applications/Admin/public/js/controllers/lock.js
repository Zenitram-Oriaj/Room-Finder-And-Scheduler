/**
 * Created by Jairo Martinez on 6/14/15.
 */
app.controller('LockCtrl', function ($scope) {

	$scope.serverOnline = false;

	$scope.$on('connected', function () {
		$scope.serverOnline = true;
	});

});
