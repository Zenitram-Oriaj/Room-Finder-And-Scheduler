/**
 * Created by Jairo Martinez on 9/12/14.
 */
var mdns = require('mdns');
var ad = {};

function createAdvertisement(cfg) {
	try {
		var txt_record = {
			name: cfg.server.name,
			uuid: cfg.server.uuid,
			role: cfg.server.role,
			type: 'GWY',
			desc: 'Agile Office Gateway Service',
			path: '/',
			port: cfg.http.port,
			ctrl: cfg.ctrl.port,
			wyfd: cfg.wyfd.port
		};

		ad = mdns.createAdvertisement(mdns.tcp('http'), cfg.http.port, {txtRecord: txt_record});
		ad.on('error', handleError);
		ad.start();
	} catch (ex) {
		handleError(ex);
	}
}

function handleError(err) {
	var log = new po.SysLog('discover', 'error', err);
	updateSysLog(log);

	switch (err.errorCode) {
		case mdns.kDNSServiceErr_Unknown:
		default:
			setTimeout(function() {
				createAdvertisement();
			}, 5000);
			break;
	}
}

module.exports.init = function(){};

module.exports.run = function(cfg){
	try {
		createAdvertisement(cfg);
	}
	catch(ex) {

	}
};