/**
 * Created by Jairo Martinez on 5/20/15.
 */

app.service('urlBuilder',function(){
	this.get = function(type) {
		switch (type) {
			case 'gw':
				return './api/gateway';
			case 'ws':
				return './api/workspaces';
			case 'ct':
				return './api/controllers';
			case 'wf':
				return './api/wayfinders';
			case 'tp':
				return './api/touchpanels';
			case 'ds':
				return './api/discovers';
		}
	}
});

app.service('data', function ($http, urlBuilder) {
	this.update = function(type,obj){
		var url = urlBuilder.get(type);
		url += '/update';
		return $http.post(url, obj);
	};

	this.create = function(type,obj){
		var url = urlBuilder.get(type);
		url += '/create';
		return $http.post(url, obj);
	};

	this.delete = function(type,obj){
		var url = urlBuilder.get(type);
		url += '/delete';
		return $http.post(url, obj);
	};

	this.collect = function(type){
		var url = urlBuilder.get(type);
		return $http.get(url);
	};

	this.fetch = function(type){
		var url = urlBuilder.get(type);
		url += '/fetch';
		return $http.get(url);
	};

	this.types = function(type){
		var url = urlBuilder.get(type);
		url += '/types';
		return $http.get(url)
	};

	////////////////////////////////////////////////////////
	//

	this.info = function () {
		return $http.get('./api/dashboard/info')
	};

	this.history = function () {
		return $http.get('./api/dashboard/history');
	};

	this.events = function () {
		return $http.get('./api/dashboard/events');
	};

	this.timeZones = function () {
		return $http.get('./api/timezones');
	};

	this.schedules = function(ws){
		return $http.get('./api/schedule/' + ws.reserveId.toString() + '?');
	};

	this.logs = function () {
		return $http.get('./api/server/logs');
	};

	this.restart = function(id){
		return $http.get('./api/restart/' + id + '?');
	}
});