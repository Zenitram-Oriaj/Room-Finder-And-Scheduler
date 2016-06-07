/**
 * Created by Jairo Martinez on 9/5/14.
 */

var po = require('../../../po');
var url = require('url');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var cfg = {
	ctrl: {
		maxUpTime: 76000
	}
};

/*
 mac: '2046f900ab12',
 port: '80',
 firmware: '1_4',
 reg_interval: '120',
 uptime_secs: '4',
 description: 'Room 303'
 */

/*
 function durationToMs(str) {
 if (str == '00:00:00') {
 return 0;
 }

 var vals = str.split(':');
 var hh = parseInt(vals[0], 10);
 var mm = parseInt(vals[1], 10);
 var ss = parseInt(vals[2], 10);

 return ((hh * 60 * 60) * 1000) + ((mm * 60) * 1000) + (ss * 1000);
 }
 /*

 */
/**
 * Parse The IP from Request Object
 * @param req
 * @returns {*}
 * @private
 */
function _parseIP(req) {
	var tmp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	if (tmp.indexOf(':') > -1) {
		var dat = tmp.split(':');
		for (var i in dat) {
			if (dat[i].indexOf('.') > -1) {
				return dat[i];
			}
		}
		return '0.0.0.0';
	} else {
		return tmp;
	}
}

/**
 * Convert Millis To Time String
 * @param milli
 * @returns {string}
 * @private
 */
function _msToTime(milli) {
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	var hours = Math.floor((milli / (60 * 60 * 1000)) % 60);

	if (hours < 10) hours = '0' + hours.toString();
	if (minutes < 10) minutes = '0' + minutes.toString();
	if (seconds < 10) seconds = '0' + seconds.toString();

	return hours + ":" + minutes + ":" + seconds;
}

/**
 * Check The Up Time Of Controller
 * @param nw
 * @param ol
 * @returns {number}
 * @private
 */
function _checkUptime(nw, ol) {
	var nUt = parseInt(nw, 10);
	var oUt = parseInt(ol, 10);

	if (nUt > cfg.ctrl.maxUpTime) {
		return 1;
	}
	else if (nUt <= oUt) {
		return -1;
	}
	else {
		return 0;
	}
}

/**
 * Update Workspace State
 * @param ct
 * @private
 */
function _updateWS(ct) {
	db.Workspace.find({where: {uuid: ct.workspaceUuid}}).then(
		function (ws) {
			if (ws) {
				if (ws.status != ct.state) {
					ws.status = ct.state;
					ws.save();
				}
			}
		},
		function (err) {
		});
}

/**
 * Update The Controller Event Info
 * @param ct
 * @param st
 * @private
 */
function _updateCT(ct, st) {
	ct.prevState = ct.state;
	ct.state = st;
	ct.prevEventAt = ct.eventAt;
	ct.eventAt = new Date();
	ct.save();
	_updateWS(ct);
}

/**
 * Compare Controllers
 * @param dbo
 * @param evt
 * @param cb
 * @returns {Function}
 * @private
 */
function _compare(dbo, evt, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	dbo.status = 'ONLINE';

	if (evt.ip !== dbo.ip) dbo.ip = evt.ip;
	if (evt.description !== dbo.description) dbo.description = evt.description;
	if (evt.firmware !== dbo.firmware) dbo.firmware = evt.firmware;

	var i = _checkUptime(evt.uptime, dbo.uptime);
	if (i > 0) {
		if (dbo.autoReboot == 1) {

		} else {
			dbo.autoReboot = 1;
			dbo.lapseCount += 1;
		}
	}
	else if (i < 0) {
		dbo.autoReboot = 0;
		dbo.rebootCount += 1;
		dbo.rebootAt = new Date();
	}

	dbo.prevUptime = dbo.uptime;
	dbo.uptime = evt.uptime;

	dbo.prevHeartbeatAt = dbo.heartbeatAt;
	dbo.heartbeatAt = new Date();
	dbo.save().then(
		function (res) {
			cb(null, dbo);
		},
		function (err) {
			cb(null, dbo);
		});
}

/**
 * Find Previous Event For The Controller
 * @param ct
 * @param cb
 * @returns {function}
 * @private
 */
function _findEVNT(ct, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	db.ControllerEvent
		.findOne({
			where: {uuid: ct.uuid},
			order: [['id', 'DESC']]
		})
		.then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			cb(err, null);
		}
	);
}

/**
 * Find Controller
 * @param uuid
 * @param cb
 * @returns {Function}
 * @private
 */
function _findCTRL(uuid, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	db.Controller
		.find({where: {uuid: uuid}}).then(
		function (ct) {
			cb(null, ct);
		},
		function (err) {
			var log = new po.SysLog('controller', 'error', 'Error Occurred While Locating Controller :: ' + uuid);
			updateSysLog(log);
			cb(err, null);
		});
}

/**
 * Register The Controller
 * @param ct
 * @param cb
 * @returns {Function}
 * @private
 */
function _register(ct, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	_findCTRL(ct.uuid, function (err, dbo) {
		if (err) {
			cb(err, null);
		}
		if (dbo == null) {
			ct.prevHeartbeatAt = new Date();
			ct.heartbeatAt = new Date();
			ct.save().then(
				function (rct) {
					module.exports.emit('registration');
					cb(null, rct);
				},
				function (err) {
					var log = new po.SysLog('controller', 'error', 'Failed To Save Controller :: ' + ct.uuid);
					updateSysLog(log);
					cb(err, null);
				});
		} else {
			_compare(dbo, ct, function (err, res) {
				cb(err, res);
			});
		}
	})
}

/**
 * Create A Controller Event
 * @param ct
 * @param prev
 * @param cb
 * @returns {Function}
 * @private
 */
function _create(ct, prev, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	var evt = (ct.state === 1) ? 'occupied' : 'available';

	if (!prev.eventAt) {
		prev.eventAt = new Date();
	}

	var duration = '00:00:00';

	db.ControllerEvent
		.create({
			uuid:     ct.uuid,
			event:    'WAITING',
			state:    evt,
			duration: duration
		})
		.then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			var log = new po.SysLog('controller', 'error', 'Failed To Create Controller Event :: ' + ct.uuid);
			updateSysLog(log);
			cb(err, null);
		});
}

/**
 * Build The Controller Object
 * @param qd
 * @returns {*}
 * @private
 */
function _build(qd) {
	return db.Controller.build({
		ip:          qd.ip,
		port:        qd.port,
		uuid:        qd.address.toUpperCase(),
		description: qd.description,
		firmware:    qd.firmware,
		heartbeat:   qd.reg_interval,
		uptime:      qd.upTime,
		status:      'ONLINE',
		mode:        'A'
	});
}

/**
 * Collect All Controllers From Database
 * @param cb
 * @returns {Function}
 * @private
 */
function _collect(cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	db.Controller.findAll().then(
		function (cts) {
			cb(null, cts);
		},
		function (err) {
			cb(err, null);
		});
}

/////////////////////////////////////////////////////////////////////
// MODULE EXPORTS

/**
 * Event Emitter Export
 * @type {*|EventEmitter}
 */
module.exports = new EventEmitter();

/**
 * Initialization Method
 * @param c
 * @param cb
 */
module.exports.init = function (c, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		cfg = c;
		_collect(function (err, cts) {
			if (err) {
				cb(err, null);
			} else {
				for (var i in cts) {
					_updateWS(cts[i]);
				}
				cb(null, 'OK');
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

/**
 * Basic GET URL For Testing Port
 * @param req
 * @param res
 */
module.exports.get = function (req, res) {
	try {
		res.type('application/json');
		res.status(200).json({status: 'Service Running'});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

/**
 * Registration URL For Controllers
 * @param req
 * @param res
 */
module.exports.registration = function (req, res) {
	res.type('application/xml');

	try {
		var qd = url.parse(req.url, true).query;
		qd.upTime = Math.ceil(qd.uptime_secs / 60);

		var ip = _parseIP(req);
		qd.ip = req.ip.replace(/[a-zA-Z:]/g, '');

		if (qd.ip != ip) {
			console.error('IP Addresses DO NOT MATCH');
		}

		var c = _build(qd);

		_register(c, function (err, rsl) {
			if (err) {
				res.status(404).json({});
			} else {
				res.status(200).json(rsl);
			}
		});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

/**
 * Status URL For Controllers
 * @param req
 * @param res
 */
module.exports.status = function (req, res) {
	res.type('application/xml');

	try {
		var qd = url.parse(req.url, true).query;
		var st = parseInt(qd.state, 10);
		var ip = _parseIP(req);
		var uuid = '';

		if (qd && qd.address) {
			uuid = qd.address.toUpperCase();
		} else {
			var log = new po.SysLog('controller', 'error', 'Invalid Data Received From Unknown Controller :: ' + ip);
			updateSysLog(log);
		}

		_findCTRL(uuid, function (err, ct) {
			if (ct !== null) {
				var prv = ct.lastEvent();

				if (ct.state !== st) {
					_updateCT(ct, st);
					_findEVNT(ct, function (err, evt) {
						if (err) {
							console.error(err);
						} else {
							var dt = new Date();
							evt.millis = (dt.getTime() - evt.createdAt.getTime());
							evt.duration = _msToTime(evt.millis);
							evt.event = 'COMPLETE';
							evt.save();
						}
					});

					_create(ct, prv, function (err) {
						if (err) {
							res.status(404).json({});
						} else {
							res.status(200).json({});
						}
					});
				} else {
					res.status(304).json({});
				}
			} else {
				res.status(404).json({});
			}
		});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};