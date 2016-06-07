/**
 * Created by Jairo Martinez on 9/24/14.
 */

var workspaces = [];
var po = require('../../../po');
var rs = require('../../../modules/scheduling/resourceScheduler');

function init() {
	if (global.cfg.schd.enabled) {
		if (global.cfg.schd.external) {
			rs.init(global.cfg, function (err, cl) {
				if (err) {

				} else {
					setInterval(CollectReservations, 60 * 1000);
				}
			});
			rs.users();

		} else {

		}
	}
}

function SetScheduledFlag(dat) {
	var dt = new Date();
	dt.setHours(23);
	db.Workspace
		.findAll({where: {reservable: 1}}).then(
		function (res) {
			if (res) {
				res.forEach(function (ws) {
					var fnd = false;
					for (var i in dat) {
						var ds = new Date(dat[i].stopTime);
						if (dat[i].resourceId == ws.reserveId && ds < dt) {
							fnd = true;
							break;
						}
					}
					if (fnd) ws.scheduled = 1;
					else ws.scheduled = 0;

					ws.save();
				});
			}
		},
		function (err) {
			console.error(err);
		});
}

function CollectReservations() {
	var r = new po.Result();
	r.data = [];

	db.Reservation.findAll().then(
		function (res) {
			if (res && res.length > 0) {
				SetScheduledFlag(res);
			} else {
				//console.warn('WARN - NO Reservations Found');
			}
		},
		function (err) {
			console.error(err);
		});
}

function CollectReservationsByWs(id, cb) {
	var r = new po.Result();
	r.data = [];

	db.Reservation
		.findAll({where: {resourceId: id}})
		.then(
		function (res) {
			if (res) {
				cb(null, res);
			} else {
				//console.warn('WARN - NO Reservations Found For ID ' + id);
				cb(null, []);
			}
		},
		function (err) {
			r.code = 500;
			r.message = "Error Get Schedule Data";
			r.data = err;
			cb(err, r);
		});
}

init();

//////////////////////////////////////////////////////////////
//

module.exports.get = function (req, res) {
	try {
		var resId = parseInt(req.params.resId,10);

		if(resId && resId > 0){
			rs.GetReservationsByResource(resId, function (err, dat) {
				if (err) {
					res.status(500).json(err);
				} else {
					if (dat && dat.GetReservationsByResourceResult && dat.GetReservationsByResourceResult.ReservationData) {
						rs.ParseReservationsData(resId, dat, function (err, lst) {
							if (err) {
								res.status(500).json(err);
							} else {
								res.status(200).json(lst);
							}
						});
					} else {
						res.status(200).json({error:'NO RESERVATIONS'});
					}
				}
			});
		} else {
			res.status(404).json({error:'No ReserveID found'});
		}
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.getLocal = function (req, res) {
	try {
		var resId = req.params.resId;

		CollectReservationsByWs(resId, function (err, dat) {
			if (err) {
				r.code = 500;
				r.message = err;
				r.data = {};
			} else {
				r.code = 200;
				r.message = "Room Is Reservable";
				r.data = dat.data;
			}
			res.status(r.code).json(dat);
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.resource = function (req, res) {
	try {
		var r = new po.Result();
		var resId = req.params.resId;

		rs.GetResource(resId, function (err, dat) {
			if (err) {
				res.status(404).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.create = function (req, res) {
	try {
		var rd = req.body;

		rs.CreateReservation(rd, function (err, rslt) {
			if (err) {
				res.status(500).json(err);
			} else {
				global.reqUpdate();
				res.status(200).json(rslt);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.update = function (req, res) {
	try {
		var rd = req.body;

		rs.UpdateReservation(rd, function (err, rslt) {
			if (err) {
				res.status(500).json(err);
			} else {
				global.reqUpdate();
				res.status(200).json(rslt);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.remove = function (req, res) {
	try {
		var rd = req.body;

		rs.RemoveReservation(rd, function (err, rslt) {
			if (err) {
				res.status(500).json(err);
			} else {
				global.reqUpdate();
				res.status(200).json(rslt);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

//////
// TEMP ROUTES

module.exports.location = function (req, res) {
	try {
		var locId = req.params.locId;

		rs.GetLocation(locId, function (err, dat) {
			if (err) {
				res.status(404).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.group = function (req, res) {
	try {
		var grpId = req.params.grpId;

		rs.GetGroup(grpId, function (err, dat) {
			if (err) {
				res.status(404).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.setups = function (req, res) {
	try {
		var active = false;

		rs.GetResourceSetups(active, function (err, dat) {
			if (err) {
				res.status(404).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.searchableUDF = function (req, res) {
	try {
		rs.GetSearchableUserDefinedFields(function (err, dat) {
			if (err) {
				res.status(404).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.typeSummaries = function (req, res) {
	try {
		var hotelTypes = false;
		var nonHotelTypes = false;

		rs.GetResourceTypeSummaries(hotelTypes, nonHotelTypes, function (err, dat) {
			if (err) {
				res.status(404).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};