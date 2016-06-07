/**
 * Created by digimenet on 7/8/14.
 */

var app = angular.module('app', [
	'ngResource',
	'ngAnimate',
	'ui.bootstrap',
	'ui.select',
	'FBAngular',
	'ngStorage',
	'x2js',
	'chartjs'
]);

app.run(function(){
	Chart.defaults.global.animation = false;
});