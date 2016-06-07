/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.factory('d3', function ($window) {
	var d3 = {};
	if($window.d3){
		d3 = $window.d3;
		//d3 = Object.create($window.d3);
		//d3 = $.extend({}, $window.d3);
	}
	return d3;
});