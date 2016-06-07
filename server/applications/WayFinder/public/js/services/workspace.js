/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('workspace', function ($http) {
	this.getWsStatus = function (locationId, floorId) {
		return $http.get('./api/getWsStatus?locationId=' + locationId + '&floorId=' + floorId);
	};

	this.getWs = function (uuid, locationId, floorId) {
		return $http.get('./json/workspace/' + uuid + '?locationId=' + locationId + '&floorId=' + floorId);
	};

	this.collect = function (locationId, floorId) {
		return $http.get('./json/workspaces?locationId=' + locationId + '&floorId=' + floorId);
	};
});