/**
 * Created by Jairo Martinez on 6/19/15.
 */

var app = angular.module('app',['ngStorage']);

app.controller('ResetCtrl', function($scope, $window, $localStorage, $timeout, $sessionStorage){

	$scope.text = 'Clearing Out Local And Session Storage Data';
	$localStorage.$reset();
	$sessionStorage.$reset();

	$timeout(function(){
		$window.location.href = $window.location.origin;
	}, 1000);
});