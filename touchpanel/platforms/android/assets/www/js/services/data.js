/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('data', function ($http) {

	this.register = function (url, obj) {
		var req = url + '/api/register';
		return $http.post(req,obj);
	};

	this.tpUpdate = function (url, obj) {
		var req = url + '/api/tpUpdate';
		return $http.post(req,obj);
	};

	this.heartbeat = function (url, obj) {
		var req = {
			method:  'POST',
			url:     url + '/api/heartbeat',
			data:    obj
		};

		return $http(req);
	};

	this.myIP = function(url){
		var req = {
			method:  'GET',
			url:     url + '/myIP'
		};

		return $http(req);
	};

	this.collect = function (resId, url) {
		var uri =  url + '/json/getSchedule/' + resId;
		return $http.get(uri);
	};

	this.info = function (resId, url) {
		var req = {
			method:  'GET',
			url:     url + '/json/workspaceByResId/' + resId
		};

		return $http(req);
	};

	this.fetch = function (url) {

		var req = {
			method:  'GET',
			url:     url + '/json/schedule/fetch'
		};

		return $http(req);
	};

	this.create = function (res, url) {
		var req = {
			method:  'POST',
			url:     url + '/json/schedule/create',
			data:    res
		};

		return $http(req);
	};

	this.update = function (res, url) {
		var req = {
			method:  'POST',
			url:     url + '/json/schedule/update',
			data:    res
		};

		return $http(req);
	};

	this.remove = function (res, url) {
		var req = {
			method:  'POST',
			url:     url + '/json/schedule/remove',
			data:    res
		};

		return $http(req);
	};
});
