/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('data', function ($http) {

	this.register = function (obj) {
		var req = './api/register';
		return $http.post(req,obj);
	};

	this.heartbeat = function (obj) {
		var req = './api/heartbeat';
		return $http.post(req,obj);
	};

	this.getUuid = function (obj) {
		var req = './api/uuid';
		return $http.post(req,obj);
	};

	this.myIP = function(){
		return $http.get('./myIP');
	};
});
