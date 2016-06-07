/**
 * Created by Jairo Martinez on 10/13/14.
 */

var async = require('async');
var xml2js = require('xml2js');
var log = {};
var cfg = {};

function XmlToJson(xml, cb) {
	var parser = new xml2js.Parser({
		mergeAttrs: true
	});

	parser.parseString(xml, function (err, result) {
		if (err) {
			cb(null, err);
		} else {
			cb(null, result);
		}
	});
}

function SendReq(url, cb) {
	var req = require('request');
	var e = {
		code:    0,
		message: '',
		xml:     '',
		err:     {}
	};

	var opts = {
		url:     url,
		timeout: 5000
	};

	req(opts, function (err, res, body) {
		if (err) {
			e.code = err.code;
			e.xml = '<IPSensorError>\n<Failed reason="' + e.code + '"></Failed>\n</IPSensorError>';
			e.err = err;
			e.message = 'Failed';
			cb(e, null);
		} else {
			var str = body.replace(/(\r\n|\n|\r)/gm, "");
			str = str.replace(/\s+/gm, " ");
			cb(null, str);
		}
	});
}

function CheckController(ct, cb) {
	var url = 'http://' + ct.ip + '/settings_m2m?';
	try {
		SendReq(url, function (err, res) {
			if (err) {
				cb(null, err.xml);
			} else {
				cb(null, res);
			}
		});
	}
	catch(ex){
		ex.xml = '<IPSensorError>\n<Failed reason="Exception"></Failed>\n</IPSensorError>';
		cb(null,ex.xml)
	}

}

function CheckState(ct, cb) {
	var url = 'http://' + ct.ip + '/setoutputs?password=' + ct.password + '&value=x';
	SendReq(url, function (err, res) {
		if (err) {
			cb(null, null);
		} else {
			XmlToJson(res, function (err, jsn) {
				if (err) {
					cb(err, null);
				} else {
					var i = parseInt(jsn.IPSensorResponse.GPIOOutputs[0].state[0], 10);

					if (ct.state != i) {
						ct.state = i;
						ct.save();
					}
					cb(null, jsn);
				}
			});
		}
	});
}

function CheckHeartbeat(ct) {
	var dt = new Date();

	if (ct.heartbeatAt) {
		var offset = dt.getTime() - ct.heartbeatAt.getTime();
		var refVal = (6 * 60 * 1000);
		return (offset > refVal);
	} else {
		return false;
	}
}

function RebootCtrl(ct, cb) {
	var url = 'http://' + ct.ip + '/reboot?password=' + ct.password;
	SendReq(url, function (err, res) {
		cb(err, res);
	});
}

function CheckAutoReboot(ct) {
	if (ct.autoReboot == 1 || ct.uptime > cfg.ctrl.maxUpTime) {
		var dt = new Date();

		if (dt.getHours() < 5 || dt.getHours >= 22) {
			RebootCtrl(ct, function (err, res) {
				if (err) {
					console.error(err);
				}
			});
		}
	}
}

function UpdateDiscoverStatus(cb) {
	CollectControllers(function (err, cts) {
		if (err) {
			cb(err, null);
		} else {
			CollectDiscover(function (err, dsc) {
				if (err) {
					cb(err, null);
				} else {
					for (var i in dsc) {
						if (dsc[i].added == 'no') {
							for (var j in cts) {
								if (cts[j].uuid == dsc[i].uuid && cts[j].workspaceUuid && cts[j].workspaceUuid.length > 0) {
									dsc[i].added = 'yes';
									dsc[i].addedAt = new Date();
									dsc[i].save();
									break;
								}
							}
						}
					}
					cb(null, 'OK');
				}
			});
		}
	});
}

function CollectDiscover(cb) {
	db.Discover.findAll({where: {typeDev: 'IPS'}}).then(
		function (ds) {
			if (ds) {
				cb(null, ds);
			} else {
				cb('No Discovered Controllers Found', null);
			}
		},
		function (err) {
			cb(err, null);
		});
}

function CollectControllers(cb) {
	db.Controller.findAll().then(
		function (cts) {
			cb(null, cts);
		},
		function (err) {
			cb(err, null);
		});
}

/////////////////////////////////////////////////////////////////////////////
// Module Exports

module.exports.config = function(c){
	cfg = c || {};
};

module.exports.check = function (cb) {
	try {
		UpdateDiscoverStatus(function (err, res) {
			cb(err, res);
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.init = function (cb) {
	try {
		CollectControllers(function (err, cts) {
			if (err) {
				console.error(err);
				cb(err, null);
			} else {
				var Ctrls = [];

				for (var i in cts) {
					if (cts[i].status == 'ONLINE') Ctrls.push(cts[i]);
				}

				if (Ctrls.length > 0) {
					async.mapSeries(Ctrls, CheckState, function (err, res) {
						cb(err, res);
					});
				}
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.run = function () {
	try {
		CollectControllers(function (err, cts) {
			if (err) {
				console.error(err);
			} else {
				var Ctrls = [];
				if (cts && cts.length > 0) {
					cts.forEach(function (ct) {
						CheckAutoReboot(ct);
						if (CheckHeartbeat(ct)) {
							if (ct.status == 'ONLINE') {
								log = new po.SysLog('controller', 'error', 'Controller OFFLINE  :: ' + ct.uuid);
								updateSysLog(log);
								ct.status = 'OFFLINE';
								ct.save();
							}
							Ctrls.push(ct);
						} else {
							if (ct.status == 'OFFLINE') {
								log = new po.SysLog('controller', 'info', 'Controller is now ONLINE  :: ' + ct.uuid);
								updateSysLog(log);
								ct.status = 'ONLINE';
								ct.save();
							}
						}
					});
				}

				if (Ctrls.length > 0) {
					async.mapSeries(Ctrls, CheckController, function (err, results) {
						if (err) {
						} else {
							async.mapSeries(results, XmlToJson, function (err, json) {
							});
						}
					});
				}
			}
		});
	}
	catch (ex) {
		log = new po.SysLog('controller', 'error', 'Monitor Run Service Had Exception  :: ' + JSON.stringify(ex));
		updateSysLog(log);
	}
};