/**
 * Created by Jairo Martinez on 10/12/14.
 */

var async = require('async');
var http = require('http');
var xml2js = require('xml2js');
var config = {};

function BuildUrlString(ct, type) {
	var url = "";
	switch (type) {
		case 1:
		{
			url = 'http://' + ct.addresses + '/settings_m2m?';
			break;
		}
		case 2:
		{
			url = 'http://' + ct.addresses +
				'/settings_m2m?serv1url=http://' + config.network.ip + ':' + config.ctrl.port.toString() + '/registration' +
				'&gpio_callback=http://' + config.network.ip + ':' + config.ctrl.port.toString() + '/status' +
				'&reg_iv=' + config.ctrl.heartbeat.toString() +
				'&dev_pswd=' + config.ctrl.password +
				'&gpix_rtms=' + config.ctrl.timeout;
			break;
		}
		case 3:
		{
			url = 'http://' + ct.addresses + '/reboot?password=' + config.ctrl.factoryPass;
			break;
		}
		case 4:
		{
			url = 'http://' + ct.addresses + '/reboot?password=' + config.ctrl.password;
			break;
		}
		default :
			break;
	}

	return url;
}

function GetType(cmd) {
	switch (cmd) {
		case 'COLLECT':
			return 1;
		case 'CONFIGURE':
			return 2;
		case 'REBOOT':
			return 3;
		case 'RESTART':
			return 4;
		default:
			return 0;
	}
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

			var log = new po.SysLog('discover', 'error', 'Error Occured On Request :: ' + err);
			updateSysLog(log);

			e.code = err.code;
			e.xml = '<IPSensorError>\n<Failed reason="' + e.code + '"></Failed>\n</IPSensorError>';
			e.err = err;
			e.message = 'Failed';
			cb(null, e.xml);
		} else {
			var str = body.replace(/(\r\n|\n|\r)/gm, "");
			str = str.replace(/\s+/gm, " ");
			cb(null, str);
		}
	});
}

function XmlToJson(xml, cb) {
	var parser = new xml2js.Parser({
		mergeAttrs: true
	});

	parser.parseString(xml, function (err, res) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, res);
		}
	});
}

function CheckConfigs(cts, cfgs, cb) {
	var results = [];
	try {
		for (var cnt = 0; cnt < cts.length; cnt++) {
			if (cfgs[cnt].IPSensorConfiguration && cfgs[cnt].IPSensorConfiguration.Development) {
				if (cfgs[cnt].IPSensorConfiguration.Development[0].password[0] == config.ctrl.password) {
					cts[cnt].configured = 'yes';
					cts[cnt].save();
					results.push('CONFIGURED');
				}
				else if (cfgs[cnt].IPSensorConfiguration.Development[0].password[0] == config.ctrl.factoryPass) {
					results.push('FACTORY');
				} else {
					results.push(cfgs[cnt].IPSensorConfiguration.Development[0].password[0]);
				}
			} else {
				results.push('ERROR');
			}
		}
		cb(null, results);
	} catch (ex) {
		cb(ex, results);
	}
}

function RunAsyncOperation(cmd, units, cb) {
	var type = GetType(cmd);

	if (units.length > 0) {
		var urls = [];

		for (var i in units) {
			urls.push(BuildUrlString(units[i], type));
		}

		async.mapSeries(urls, SendReq, function (err, results) {
			if (err) {
				cb(err, null);
			} else {
				async.mapSeries(results, XmlToJson, function (err, json) {
					if (err) {
						console.error(err);
						cb(err, {});
					} else {
						cb(null, json);
					}
				});
			}
		});
	}
}

function CollectDiscovered(cb) {
	var units = [];
	db.Discover.findAll({where: {typeDev: 'IPS'}}).then(
		function (cts) {
			if (cts !== null) {
				cts.forEach(function (c) {
					if (c.configured == 'no' && c.status == 'up') {
						units.push(c);
					}
				});
				cb(units);
			} else {
				cb(units);
			}
		},
		function (err) {
			console.error(err);
			cb(units);
		});
}

/////////////////////////////////////////////////////////////////////
// Module Export Functions

module.exports.init = function () {
	try {

	}
	catch (ex) {

	}
};

module.exports.run = function (cfg) {
	try {
		var units = [];
		var cmd = 'COLLECT';

		config = cfg;

		CollectDiscovered(function (t) {
			units = t;
			RunAsyncOperation(cmd, units, function (err, jDat1) {
				if (err) {
					console.error('STAGE 1 :: ' + err)
				} else {
					cmd = 'CONFIGURE';
					CheckConfigs(units, jDat1, function (err, r1) {
						if (err) {
							console.error('STAGE 2 :: ' + err)
						} else {
							var cfgUnits = [];
							for (var i = 0; i < units.length; i++) {
								if (r1[i] == 'FACTORY') cfgUnits.push(units[i]);
							}
							RunAsyncOperation(cmd, cfgUnits, function (err, jDat2) {
								if (err) {
									console.error('STAGE 3 :: ' + err)
								} else {
									cmd = 'REBOOT';
									CheckConfigs(cfgUnits, jDat2, function (err, r2) {
										if (err) {
											console.error('STAGE 4 :: ' + err)
										}
										else {
											var rebootUnits = [];
											for (var i = 0; i < cfgUnits.length; i++) {
												if (r2[i] == 'CONFIGURED') rebootUnits.push(cfgUnits[i]);
											}
											RunAsyncOperation(cmd, cfgUnits, function (err, jDat3) {
												if (err) {
													console.log('STAGE 5 :: ' + err)
												}
												else {
													// console.log(jDat3);
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		})
	}
	catch (ex) {

	}
};
