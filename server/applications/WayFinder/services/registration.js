/**
 * Created by Jairo Martinez on 12/9/14.
 */

/**
 *
 *
 *
 *  rv: true,
 version: '11.0',
 versionNumber: 11,
 win: true,
 desktop: true,
 msie: true,
 name: 'msie',
 platform: 'win'

 chrome: true,
 version: '11.0.696.34',
 versionNumber: 11,

 desktop: true,
 webkit: true,
 name: 'chrome',
 platform: 'linux'

 BROWSER INFO
 {
    safari:   true | false
    chrome:   true | false
    mozilla:  true | false
    msie:     true | false

    version: string
    versionNumber: number

    mac:      true | false
    win:      true | false
    linux:    true | false
    android:  true | false
    ipad:     true | false
    iphone:   true | false

    mobile:   true | false
    desktop:  true | false

    webkit:   true | false

    name: 'safari' | 'mozilla' | 'chrome' | 'msie'
    platform: 'ipad | 'iphone' | 'mac' | 'win' | 'linux' | 'android'
  }
 */

var env = new po.Package('WYFD', 'SRVR', 0, {});
var log = {};

/////////////////////////////////////////////////////////////////////////////////////
//

function parseIP(req) {
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

function find(obj, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	obj.uuid = obj.uuid.toUpperCase();

	var ref = {};

	switch (obj.type) {
		case 'TPS':
		{
			ref = db.TouchPanel;
			break;
		}
		case 'WFD':
		default:
		{
			ref = db.WayFinder;
			break;
		}
	}

	ref.find({where: {uuid: obj.uuid}})
		.then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Failed To Find ' + obj.type + ' :: ' + obj.uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function findByIp(obj, cb) {
	var ref = {};

	cb = (typeof cb === 'function') ? cb : function () {
	};

	switch (obj.type) {
		case 'TPS':
		{
			ref = db.TouchPanel;
			break;
		}
		case 'WFD':
		default:
		{
			ref = db.WayFinder;
			break;
		}
	}

	obj.ip.trim();

	ref.find({where: {ip: obj.ip}})
		.then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			cb(err, null);
		});
}

function update(rb, nw, dbo, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	dbo.ip = nw.ip;
	dbo.config = JSON.stringify(nw, null, 2);
	dbo.os = JSON.stringify(nw.os, null, 2);

	dbo.locationId = nw.locationId;
	dbo.floorId = nw.floorId;

	if (rb == true) {
		dbo.rebootCount += 1;
		dbo.rebootAt = new Date();
	}

	if (nw.type == 'TPS') {
		dbo.reserveId = nw.reserveId;
	}

	dbo.save().then(
		function (res) {
			log = new po.SysLog('wayfinder', 'info', 'Registration Updated ' + nw.type + ' :: ' + dbo.uuid);
			updateSysLog(log);

			cb(null, res);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Registration Failed To Update ' + nw.type + ' :: ' + dbo.uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function heartbeat(nw, dbo, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	dbo.ip = nw.ip;
	dbo.config = JSON.stringify(nw, null, 2);
	dbo.os = JSON.stringify(nw.os, null, 2);

	dbo.locationId = nw.locationId;
	dbo.floorId = nw.floorId;

	dbo.prevUptime = dbo.uptime;
	dbo.uptime = nw.uptime;

	if (nw.type == 'TPS') {
		dbo.reserveId = nw.reserveId;
	}

	if (dbo.prevHeartbeatAt) {
		dbo.prevHeartbeatAt = dbo.heartbeatAt;
	} else {
		dbo.prevHeartbeatAt = new Date();
	}
	dbo.heartbeatAt = new Date();

	dbo.save().then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Heartbeat Failed To Update ' + nw.type + ' :: ' + dbo.uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function create(obj, cb) {
	var ref = {};

	cb = (typeof cb === 'function') ? cb : function () {
	};

	switch (obj.type) {
		case 'TPS':
		{
			ref = db.TouchPanel;
			break;
		}
		case 'WFD':
		default:
		{
			ref = db.WayFinder;
			break;
		}
	}

	ref.create({
		uuid:        obj.uuid.toUpperCase(),
		description: 'Automatically Add Unit',
		floorId:     obj.floorId || 'GBL',
		locationId:  obj.locationId || 'GBL',
		regionId:    obj.regionId || 'GBL',
		ip:          obj.ip,
		reserveId:   obj.reserveId,
		os:          JSON.stringify(obj.os, null, 2),
		config:      JSON.stringify(obj, null, 2),
		status:      'ONLINE'
	})
		.then(
		function (res) {
			log = new po.SysLog('wayfinder', 'info', 'Added New ' + obj.type + ' :: ' + obj.uuid);
			updateSysLog(log);

			cb(null, res);
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Failed To Save ' + obj.type + ' :: ' + obj.uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function _process(rb, obj, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	find(obj, function (err, dat) {
		if (err) {
			cb(err, null);
		} else {
			if (dat) {
				update(rb, obj, dat, function (err, dbo) {
					if (err) {
						cb(err, null);
					} else {
						var j = JSON.parse(dbo.config);
						cb(null, j);
					}
				});
			} else {
				create(obj, function (err, dbo) {
					if (err) {
						cb(err, null);
					} else {
						var j = JSON.parse(dbo.config);
						cb(null, j);
					}
				});
			}
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////
//

module.exports.register = function (req, res) {
	try {
		var obj = req.body;
		obj.ip = parseIP(req);

		if (obj.uuid && obj.uuid.length >= 10) {
			_process(true, obj, function (err, dbo) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(200).json(dbo);
				}
			});
		} else {
			res.status(404).json({error: 'MISSING UUID'});
		}
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

module.exports.update = function (req, res) {
	try {
		var obj = req.body;
		obj.ip = parseIP(req);

		if (obj.uuid && obj.uuid.length >= 10) {
			_process(false, obj, function (err, dbo) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(200).json(dbo);
				}
			});
		} else {
			res.status(404).json({error: 'MISSING UUID'});
		}
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

module.exports.heartbeat = function (req, res) {
	try {
		var obj = req.body;
		obj.ip = parseIP(req);

		if (obj.uuid && obj.uuid.length >= 10) {
			find(obj, function (err, dbo) {
				if (err) {
					res.status(500).json(err);
				} else {
					if (dbo) {
						heartbeat(obj, dbo, function (err, dbo) {
							if (err) {
								res.status(500).json(err);
							} else {
								dbo.config = JSON.parse(dbo.config);
								res.status(200).json(dbo);
							}
						});
					} else {
						res.status(404).json({});
					}
				}
			});
		} else {
			res.status(404).json({error: 'MISSING UUID'});
		}
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

module.exports.config = function (req, res) {
	try {
		var obj = req.body;

		if (obj.uuid && obj.uuid.length >= 10) {
			find(obj, function (err, dbo) {
				if (err) {
					res.status(500).json(err);
				} else {
					if (dbo) {
						dbo.config = JSON.parse(dbo.config);
						res.status(200).json(dbo);
					} else {
						res.status(404).json({});
					}
				}
			});
		} else {
			res.status(404).json({error: 'MISSING UUID'});
		}
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

module.exports.getUuidByIp = function (req, res) {
	try {
		var obj = req.body;
		obj.ip = parseIP(req);

		if (obj.ip && obj.ip.length >= 8) {
			findByIp(obj, function (err, dbo) {
				if (err) {
					res.status(500).json(err);
				} else {
					if (dbo) {
						dbo.config = JSON.parse(dbo.config);
						res.status(200).json(dbo);
					} else {
						res.status(404).json({});
					}
				}
			});
		} else {
			res.status(404).json({error: 'MISSING UUID'});
		}
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

module.exports.myIP = function (req, res) {
	try {
		var ip = parseIP(req);
		res.status(200).json({ip: ip});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};