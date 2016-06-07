/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('parseXML', function (x2jsService) {
	this.parseData = function (x, cb) {
		x2jsService.X2JS().then(function (X2JS) {
			var x2js = new X2JS();
			var r = x2js.xml2json(x);
			cb(r);
		});
	}
});

app.service('xmlSvc', function (d3, parseXML) {

	this.getData = function (layer, locationId, floorId, cb) {
		var path = "./floorplan/" + layer + ".svg?floorId=" + floorId + "&locationId=" + locationId;
		d3.xml(path, "image/svg+xml", function (xml) {
			parseXML.parseData(xml.documentElement, function (d) {
				cb(d);
			});
		});
	};

	this.getXml = function (layer, locationId, floorId, cb) {
		var path = "./floorplan/" + layer + ".svg?floorId=" + floorId + "&locationId=" + locationId;
		d3.xml(path, "image/svg+xml", function (xml) {
			cb(xml);
		});
	};
});

app.service('svgSvc', function (xmlSvc, d3) {
	var initial = "#F0F000";

	this.insertLayer = function (s, svg, layer, locationId, floorId, cb) {
		var self = svg.append("g").attr("id", layer);

		if (layer == "workspaces" || layer == "wsclick") {
			xmlSvc.getData(layer, locationId, floorId, function (j) {
				for (var n in j.g.path) {
					var wsSVG = {};
					var id = j.g.path[n]._id.split('-');
					var name = id[1].replace(/_/g, ' ');

					wsSVG = self.append("polygon")
						.attr("points", j.g.path[n]._d.replace(/[^0-9,.\s]+/g, '').trim());

					wsSVG
						.attr("id", id[0])
						.attr("name", name);

					if (layer == "workspaces") {
						wsSVG
							.attr("fill", initial);
					} else {
						wsSVG
							.attr("fill", "#FFFFFF")
							.attr("fill-opacity", "0.001")
							.on('click', function () {
								var refID = d3.select(this).attr("id");
								s.infoReq(refID);
							});
					}
					cb(wsSVG);
				}
			});
		} else {
			xmlSvc.getXml(layer, locationId, floorId, function (xl) {
				$("g#" + layer).append(xl.documentElement);
			});
		}
	};
});