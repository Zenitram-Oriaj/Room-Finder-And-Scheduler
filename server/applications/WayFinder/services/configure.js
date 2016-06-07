/**
 * Created by Jairo Martinez on 10/16/14.
 */

var fs = require('fs');
var path = require('path');
var async = require('async');
var xml2js = require('xml2js');
var log = {};

var rootDir = path.resolve(__dirname, '..');

function XmlToJson(xml, cb) {
	var parser = new xml2js.Parser({
		mergeAttrs: true
	});

	parser.parseString(xml, function (err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, result);
		}
	});
}

function FindLocation(uuid, cb) {
	db.Location
		.find({where: {uuid: uuid}})
		.then(
		function (lc) {
			if (lc) cb(null, lc);
			else cb(null, null);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Failed To Find Location :: ' + uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function FindFloor(uuid, cb) {
	db.Floor
		.find({where: {uuid: uuid}})
		.then(
		function (fl) {
			if (fl) cb(null, fl);
			else cb(null, null);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Failed To Find Floor :: ' + uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function FindWorkspace(uuid, cb) {
	db.Workspace
		.find({where: {uuid: uuid}})
		.then(
		function (ws) {
			if (ws) cb(null, ws);
			else cb(null, null);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Failed To Find Workspace :: ' + uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function BuildLocation(name, cb) {
	var location = JSON.parse(fs.readFileSync(rootDir + "/floorplans/" + name + "/location.json"));
	db.Location.create({
		uuid:        location.uuid,
		name:        location.name,
		description: location.description,
		timeZoneId:  location.timeZoneId,
		tzOffset:    location.tzOffset,
		regionId:    location.regionId,
		floors:      location.floors.toString()
	}).then(
		function (o) {
			cb(null, o);
		},
		function (err) {
			cb(err, null);
		});
}

function BuildFloor(uuid, cb) {
	var arr = uuid.split(':');
	var loc = JSON.parse(fs.readFileSync(rootDir + "/floorplans/" + arr[0] + "/location.json"));

	var floors = loc.floors;
	var floor = {};

	for(var i in floors){
		if(floors[i].uuid == arr[1]) {
			floor = floors[i];
			break;
		}
	}

	db.Floor.create({
		uuid:        uuid,
		name:        floor.name,
		description: 'Auto Created Floor For ' + arr[0],
		floorId:     arr[1],
		locationId:  arr[0]
	}).then(
		function (rslt) {
			cb(null, rslt);
		},
		function (err) {
			cb(err, null);
		});
}

function BuildWorkspace(item, cb) {
	var tmp = item.id[0].split('-');
	var id = parseInt(tmp[0], 10);
	var points = item.d[0].replace(/[a-zA-Z]/gm, "").trim();
	var name = tmp[1].replace(/[^a-zA-Z0-9]/g, ' ');

	if (id < 10) {
		id = '00' + id;
	}
	else if (id < 100) {
		id = '0' + id;
	} else {
		id = id.toString();
	}

	var uuid = item.locationId + ':' + item.floorId + ':' + id;

	db.Location.find({where: {uuid: item.locationId}}).then(
		function (lc) {
			if (lc) {
				db.Workspace.create({
					uuid:       uuid,
					name:       name,
					floorId:    item.floorId,
					locationId: item.locationId,
					timeZoneId: lc.timeZoneId || 'UTC',
					tzOffset:   lc.tzOffset || 0,
					points:     points
				}).then(
					function (rslt) {
						cb(null, rslt);
					},
					function (err) {
						cb(err, null);
					});
			}
		},
		function (err) {
			cb(err, null);
		});
}

function CheckForLocations(locations, cb) {
	locations.forEach(function (location) {
		FindLocation(location, function (err, lc) {
			if (err) {
				console.log(err);
				cb(err, null);
			} else {
				if (lc === null) {
					BuildLocation(location, function (err, rslt) {
						if (err) console.log(err);
						cb(err, rslt);
					});
				} else {
					cb(null, null);
				}
			}
		});
	});
}

function CheckForFloors(o, cb) {
	o.floors.forEach(function (floor) {
		floor = o.locationId + ':' + floor;

		FindFloor(floor, function (err, fl) {
			if (err) {
				console.log(err);
				cb(err, null);
			} else {
				if (fl === null) {
					BuildFloor(floor, function (err, rslt) {
						if (err) console.log(err);
						cb(err, rslt);
					});
				} else {
					cb(null, null);
				}
			}
		});
	});
}

function CheckForWorkspace(item, cb) {
	var tmp = item.id[0].split('-');
	var id = parseInt(tmp[0], 10);

	if (id < 10) {
		id = '00' + id;
	}
	else if (id < 100) {
		id = '0' + id;
	} else {
		id = id.toString();
	}

	var uuid = item.locationId + ':' + item.floorId + ':' + id.toString();

	FindWorkspace(uuid, function (err, ws) {
		if (err) {
			cb(err, null);
		} else {
			if (ws === null) {
				BuildWorkspace(item, function (err, rslt) {
					cb(err, rslt);
				});
			} else {
				cb(err, ws);
			}
		}
	})
}

function ReadInLocationNames(cb) {
	var locations = [];
	fs.readdir(rootDir + "/floorplans", function (err, names) {
		if (err) {
			console.log(err);
			cb(err, locations);
		} else {
			for (var i in names) {
				var d = names[i].indexOf('.');
				if (d == -1 && names[i] !== 'GBL') {
					locations.push(names[i]);
				}
			}
			cb(null, locations);
		}
	});
}

function ReadInFloorNames(name, cb) {
	var lc = {
		locationId: name,
		floors:     []
	};

	fs.readdir(rootDir + "/floorplans/" + name, function (err, names) {
		if (err) {
			console.log(err);
			cb(err, lc);
		} else {
			for (var i in names) {
				var d = names[i].indexOf('.');
				if (d == -1) {
					lc.floors.push(names[i]);
				}
			}
			cb(null, lc);
		}
	});
}

function ReadInFloorSvg(o, cb) {
	var svg = fs.readFileSync(rootDir + "/floorplans/" + o.locationId + "/" + o.floorId + "/workspaces.svg");

	XmlToJson(svg, function (err, json) {
		if (err) {
			cb(err, null);
		} else {
			json.locationId = o.locationId;
			json.floorId = o.floorId;
			cb(null, json);
		}
	});
}

module.exports.run = function () {
	try {
		ReadInLocationNames(function (err, locations) {
			if (err) {
				console.log(err);
			} else {
				CheckForLocations(locations, function (err, val) {
				});

				async.mapSeries(locations, ReadInFloorNames, function (err, items) {
					if (err) {
						console.log(err);
					} else {
						var els = [];

						items.forEach(function (item) {
							CheckForFloors(item, function (err, val) {
							});
							item.floors.forEach(function (fl) {
								var el = {
									locationId: item.locationId,
									floorId:    fl
								};
								els.push(el);
							});
						});

						async.mapSeries(els, ReadInFloorSvg, function (err, rslts) {
							if (err) {
								console.log(err);
							} else {
								var workspaces = [];
								rslts.forEach(function (item) {
									item.svg.g[0].path.forEach(function (ws) {
										ws.locationId = item.locationId;
										ws.floorId = item.floorId;
										workspaces.push(ws);
									});
								});

								async.mapSeries(workspaces, CheckForWorkspace, function (err, results) {
									if (err) {
										console.log(err);
									} else {
										results.forEach(function (r) {

										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
	catch(ex) {

	}
};