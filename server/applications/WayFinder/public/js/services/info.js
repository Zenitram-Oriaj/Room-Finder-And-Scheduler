/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('info', function ($http) {

	this.register = function(ao){
		return $http.post('./register', ao);
	};

	this.locationList = function () {
		return $http.get('./locationList');
	};

	this.floorList = function (locationId) {
		return $http.get('./floorlist?locationId=' + locationId);
	};

	this.myIP = function(){
		return $http.get('./myIP');
	};

	this.config = function (wd) {
		return $http.post('./api/config', wd);
	};
});
