/**
 * Created by Jairo Martinez on 9/12/14.
 */
var mdns = require('mdns');
var os = require('os');
var EventEmitter = require('events').EventEmitter;
var errCnt = 0;
var dscDev = [];
var fndDev = [];
var sndReq = false;

fndDev.push('000000000000');

if (os.type() == 'Linux') {
	mdns.isAvahi = true;
}

var discover = mdns.createBrowser(mdns.tcp('http'));

function getUUID(svc) {
	var str = '';
	var uuid = {
		val: '',
		typ: ''
	};
	var i = -1;
	var temp = '';

	if (svc.name.indexOf('IPSensor') > -1) {
		str = svc.name;
		uuid.typ = 'IPS';
		i = str.indexOf('r');
		temp = str.substring((i + 1), str.length);
		var p = temp.indexOf(' (');
		if (p > -1) {
			uuid.val = temp.substring(0, p).trim().toUpperCase();
		} else {
			uuid.val = temp.trim().toUpperCase();
		}
	}
	else if (
		svc.txtRecord.type.indexOf('WFD') > -1 ||
		svc.txtRecord.type.indexOf('GWY') > -1 ||
		svc.txtRecord.type.indexOf('TPS') > -1) {
		uuid.val = svc.txtRecord.uuid;
		uuid.typ = svc.txtRecord.type;
	} else {
		uuid.val = '';
	}

	return uuid;
}

function GetAddresses(svc) {
	var ips = [];

	if (!svc.addresses) {
		ips.push('0.0.0.0');
	}
	else if (svc.addresses[0]) {
		for (var i in svc.addresses) {
			if (svc.addresses[i].indexOf(':') > -1) {

			} else {
				ips.push(svc.addresses[i]);
			}
		}
	} else {
		ips = svc.addresses;
	}

	return ips.toString();
}

function updateSvc(dbo, svc, sts, cb) {
	dbo.status = sts;
	dbo.addresses = GetAddresses(svc);

	dbo.save().then(
		function (s) {
			cb(null, s);
		},
		function (err) {
			var log = new po.SysLog('discover', 'error', 'Failed To Update Device :: ' + dbo.uuid + ' :: ' + err);
			updateSysLog(log);

			cb(err, null);
		});
}

function addService(svc, cb) {
	db.Discover
		.create({
			uuid:         svc.uuid,
			host:         svc.host || '',
			fullName:     svc.fullname || '',
			typeName:     svc.type.name || '',
			typeProtocol: svc.type.protocol || '',
			typeDev:      svc.unit,
			port:         svc.port,
			addresses:    GetAddresses(svc),
			status:       'up',
			added:        'no',
			configured:   'no'
		})
		.then(
		function (res) {
			var log = new po.SysLog('discover', 'success', 'Added New Discovered Device :: ' + svc.uuid);
			updateSysLog(log);

			if (svc.unit === 'IPS') {
				module.exports.emit('newIPS');
			}
			else if (svc.unit === 'WFD') {
				module.exports.emit('newWFD');
			}
			else if (svc.unit === 'GWY') {
				module.exports.emit('newGWY');
			}
			else if (svc.unit === 'TPS') {
				module.exports.emit('newTPS');
			}
			cb(null, res);
		},
		function (err) {
			var log = new po.SysLog('discover', 'error', 'Failed To Save Discovered Device :: ' + svc.uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function findService(svc, cb) {
	db.Discover
		.find({where: {uuid: svc.uuid}})
		.then(
		function (s) { cb(null, s);},
		function (err) {
			console.error(err);
			cb(err, null);
		});
}

function discoverSvc(svc, sts) {

	var o = getUUID(svc);
	var found = false;

	svc.uuid = o.val;
	svc.unit = o.typ;

	for (var i in fndDev) {
		if (fndDev[i] == svc.uuid) found = true;
	}

	if (!found) {
		fndDev.push(svc.uuid);
		findService(svc, function (err, ref) {
			if (ref){
				if (sts == 'down') {
					var log = new po.SysLog('discover', 'warning', 'Service Down For :: ' + ref.uuid);
					updateSysLog(log);
				}

				updateSvc(ref, svc, sts, function (err, res) {});

				if(ref.configured == 'no'){
					sndReq = true;
				}

			} else {
				addService(svc, function (err, r) {});
			}
		});
	}
}

function examine(){
	for(var i in dscDev){
		discoverSvc(dscDev[i], 'up');
	}

	dscDev.length = 0;
	if(sndReq){
		module.exports.emit('newIPS');
		sndReq = false;
	}
}

function run() {
	try {
		discover.start();
	} catch (err) {
		var log = new po.SysLog('discover', 'error', 'Discover Run Routine - Error');
		updateSysLog(log);

		module.exports.emit('error', err);
	}
}

discover.on('serviceUp', function (svc) {
	var i = svc.name.indexOf('IPSensor');
	var w = -1;
	var x = -1;
	var y = -1;
	var t = {};

	if (svc.txtRecord && svc.txtRecord.type) {
		w = svc.txtRecord.type.indexOf('WFD');
		x = svc.txtRecord.type.indexOf('GWY');
		y = svc.txtRecord.type.indexOf('TPS');
	}

	if (i > -1 || w > -1 || x > -1 || y > -1) {
		dscDev.push(svc);

		if (t) {
			clearTimeout(t);
		}

		t = setTimeout(examine, 30 * 1000);
	}
});

discover.on('serviceDown', function (svc) {
	var i = svc.name.indexOf('IPSensor');
	var w = -1;
	var x = -1;
	var y = -1;

	if (svc.txtRecord && svc.txtRecord.type) {
		w = svc.txtRecord.type.indexOf('WFD');
		x = svc.txtRecord.type.indexOf('GWY');
		y = svc.txtRecord.type.indexOf('TPS');
	}

	if (i > -1 || w > -1 || x > -1 || y > -1) discoverSvc(svc, 'down');
});

discover.on('error', function (err, svc) {
	errCnt++;

	if (errCnt >= 99) {
		errCnt = 1;
		discover.stop();
	}

	module.exports.emit('error', err);
});

module.exports = new EventEmitter();

module.exports.run = run;
