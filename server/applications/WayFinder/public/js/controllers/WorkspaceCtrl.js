/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.controller('WorkspaceCtrl', function ($scope, $window, $element, d3, xmlSvc, svgSvc, workspace) {
	$scope.FlrWorkSpace = [];
	var dim = {
		container: '',
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		r: 0,
		vbx: {
			w: 0,
			h: 0
		}
	};

	var layerNames = ["zones", "workspaces", "floorplan", "text_names", "wsclick", "text_nav"]; //
	var occupied = "#EE0000";
	var available = "#00CC00";
	var offline = "#F0F000";

	var serverOffline = function () {
		for (var i in $scope.FlrWorkSpace) {
			$scope.FlrWorkSpace[i].attr("fill", function () {
				return offline;
			});
		}
	};

	var updateStatus = function (cts) {
		for (var p in cts) {
			for (var i in $scope.FlrWorkSpace) {
				var id = cts[p].uuid.split(':');
				if ($scope.FlrWorkSpace[i].attr('id') == parseInt(id[2], 10)) {
					$scope.FlrWorkSpace[i].attr("fill", function () {
						return (cts[p].state == 1) ? occupied : available;
					});
				}
			}
		}
	};

	xmlSvc.getData(layerNames[0], $scope.ao.crnt.locationId, $scope.ao.crnt.floorId, function (d) {
		dim.container = "#floorplan-container";
		dim.vbx.w = Math.ceil(d._width);
		dim.vbx.h = Math.ceil(d._height);
		dim.x = d._x;
		dim.y = d._y;
		dim.w = $(dim.container).width();
		dim.r = 1.78;
		dim.h = dim.vbx.h;

		if (dim.h < 100) dim.h = dim.vbx.h;

		var svg = d3.select(dim.container)
			.append("svg")
			.attr("viewBox", dim.x.toString() + " " + dim.y.toString() + " " + dim.vbx.w.toString() + " " + dim.vbx.h.toString())
			.attr("width", dim.w)
			.attr("height", dim.h);

		layerNames.forEach(function (layerName) {
			svgSvc.insertLayer($scope, svg, layerName, $scope.ao.crnt.locationId, $scope.ao.crnt.floorId, function (s) {
				$scope.FlrWorkSpace.push(s);
			});
		});

		$window.onresize = function () {
			var w = $(dim.container).width();
			var h = Math.ceil(dim.w / dim.r);

			svg.attr("width", w);
			svg.attr("height", h);
			$scope.$apply();
		};
	});

	setInterval(function () {
		workspace.getWsStatus($scope.ao.crnt.locationId, $scope.ao.crnt.floorId).then(
			function (res) {
				updateStatus(res.data);
			},
			function (err) {
				console.log(err.statusText);
				serverOffline();
			});
	}, 5000);
});