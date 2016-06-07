/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('schedule', function ($http) {
	this.collect = function () {
		return $http.get('./json/getSchedules');
	};

	this.resObj = function () {
		return $http.get('./json/schedule/fetch');
	};

	this.getWsSchd = function (resId) {
		return $http.get('./json/getSchedule/' + resId);
	};

	this.create = function (res) {
		return $http.post('./json/schedule/create', res);
	};

	this.update = function (res) {
		return $http.post('./json/schedule/update', res);
	};

	this.remove = function (res) {
		return $http.post('./json/schedule/remove', res);
	};

});