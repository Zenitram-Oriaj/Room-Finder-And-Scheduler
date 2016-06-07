/**
 * Created by Jairo Martinez on 7/19/15.
 */

/**
 *
 { [Error: connect ECONNREFUSED]
	code: 'ECONNREFUSED',
	errno: 'ECONNREFUSED',
	syscall: 'connect',
	level: 'client-socket' }

 { [Error: All configured authentication methods failed] level: 'client-authentication' }
 { [Error: Timed out while waiting for handshake]        level: 'client-timeout' }
 *
 */


var async = require('async');
var log = {};
var ssh = require('ssh2').Client;
var cmdTP = ['su\n','am force-stop com.boisolutions.agileoffice\n' ,'am start com.boisolutions.agileoffice/.MainActivity\n', 'exit\n'];
var cmdWF = ['', '', '', 'exit\n'];

function checkError(err){
	if(err.level){
		return err.level;
	} else {
		if(err.indexOf("client-authentication")){
			return 'client-authentication'
		}
		else if(err.indexOf("client-timeout")){
			return 'client-timeout'
		} else {
			return 'client-unknown';
		}
	}
}

function parseTpSshRes(str) {
	if (str.indexOf('exit') > -1) {
		return 4;
	}
	else if (str.indexOf('Starting:') > -1) {
		return 3;
	}
	else if (str.indexOf('/ #') > -1) {
		return 1;
	}
	else if (str.indexOf('/ $') > -1) {
		return 0;
	}
	else {
		return 0;
	}
}

function parseWfSshRes(str) {
	return 3;
}

function CheckTouchPanel(tp, cb) {
	var conn = new ssh();
	var cCnt = 0;
	conn.on('ready', function () {
		var str = '';
		conn.shell(function (err, stream) {
			if (err) throw err;

			stream.on('close', function () {
				conn.end();
				tp.ssh = 'ONLINE';
				tp.save();
				cb(null, 'OK');
			});

			stream.on('data', function (data) {
				str += data.toString('utf8');

				if (str.indexOf('\n')) {
					var t = str.substr(0, str.length - 1);
					var v = parseTpSshRes(t);
					str = '';

					if (v > 2) {
						conn.end();
					}
					else if (v > 0) {
						if(v == 1){
							cCnt += 1;
						}

						if(cCnt == 2){
							stream.write(cmdTP[2]);
						} else {
							stream.write(cmdTP[v]);
						}
					}
					else {
						//
					}
				}
			});

			stream.stderr.on('data', function (data) {

			});

			stream.write(cmdTP[0]);

		});
	}).on('error', function (err) {
		var log = new po.SysLog('wayfinder', 'error', 'Unable To Connect To TP ' + tp.ip + ' :: ' + checkError(err));
		updateSysLog(log);

		tp.ssh = 'OFFLINE';
		tp.save();
		cb(null, checkError(err));
	}).connect({
		host:         tp.ip,
		port:         tp.sshPort,
		username:     'roomfinder',
		password:     'boi123',
		readyTimeout: 10000
	});
}

function CheckWayFinder(wf, cb) {
	var conn = new ssh();
	conn.on('ready', function () {
		var str = '';

		conn.shell(function (err, stream) {
			if (err) throw err;

			stream.on('close', function () {
				conn.end();

				wf.ssh = 'ONLINE';
				wf.save();
				cb(null, 'OK');
			});

			stream.on('data', function (data) {
				str += data.toString('utf8');

				if (str.indexOf('\r\n')) {
					var t = str.substr(0, str.length - 1);
					var v = parseWfSshRes(t);
					str = '';

					if (v > 2) {
						conn.end();
					}
					else if (v > 0) {
						stream.write(cmdWF[v]);
					}
					else {
						//
					}
				}
			});

			stream.stderr.on('data', function (data) {

			});

			stream.write(cmdWF[0]);

		});
	}).on('error', function (err) {
		var log = new po.SysLog('wayfinder', 'error', 'Unable To Connect To WF ' + wf.ip + ' :: ' + checkError(err));
		updateSysLog(log);

		wf.ssh = 'OFFLINE';
		wf.save();
		cb(null, checkError(err));
	}).connect({
		host:         wf.ip,
		port:         wf.sshPort,
		username:     'roomfinder',
		password:     'boi123',
		readyTimeout: 10000
	});
}

function CheckHeartbeat(obj) {
	var dt = new Date();

	if (obj.heartbeatAt) {
		var offset = dt.getTime() - obj.heartbeatAt.getTime();
		var refVal = (6 * 60 * 1000);
		return (offset > refVal);
	} else {
		return false;
	}
}

function CollectTouchPanels(cb) {
	db.TouchPanel.findAll().then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			cb(err, null);
		});
}

function CollectWayFinders(cb) {
	db.WayFinder.findAll().then(
		function (res) {
			cb(null, res);
		},
		function (err) {
			cb(err, null);
		});
}

/////////////////////////////////////////////////////////////////////////////
// Module Exports

module.exports.init = function () {
	try {
		var tps = [];
		CollectTouchPanels(function (err, dbs) {
			if (err) {
				console.error(err);
			} else {
				if (dbs && dbs.length > 0) {
					dbs.forEach(function (o) {
						tps.push(o);
					});

					if (tps.length > 0) {
						async.mapSeries(tps, CheckTouchPanel, function (err, results) {
							if (err) {
							} else {

							}
						});
					}
				}
			}
		});
	}
	catch (ex) {

	}

	try {
		var wfs = [];
		CollectWayFinders(function (err, dbs) {
			if (err) {
				console.error(err);
			} else {
				if (dbs && dbs.length > 0) {
					dbs.forEach(function (o) {
						wfs.push(o);
					});

					if (wfs.length > 0) {
						async.mapSeries(wfs, CheckWayFinder, function (err, results) {
							if (err) {
							} else {

							}
						});
					}
				}
			}
		});
	}
	catch (ex) {

	}

};

module.exports.run = function () {
	try {
		var tps = [];
		CollectTouchPanels(function (err, dbs) {
			if (err) {
				console.error(err);
			} else {
				if (dbs && dbs.length > 0) {
					dbs.forEach(function (o) {
						if (CheckHeartbeat(o)) {
							tps.push(o);
							if (o.status == 'ONLINE') {
								log = new po.SysLog('wayfinder', 'error', 'Touch Panel OFFLINE  :: ' + o.uuid);
								updateSysLog(log);

								o.status = 'OFFLINE';
								o.save();
							}
						} else {
							if (o.status == 'OFFLINE') {
								log = new po.SysLog('wayfinder', 'info', 'Touch Panel is now ONLINE  :: ' + o.uuid);
								updateSysLog(log);

								o.status = 'ONLINE';
								o.save();
							}
						}
					});

					if (tps.length > 0) {
						async.mapSeries(tps, CheckTouchPanel, function (err, results) {
							if (err) {
							} else {

							}
						});
					}
				}
			}
		});
	}
	catch (ex) {

	}

	try {
		var wfs = [];
		CollectWayFinders(function (err, dbs) {
			if (err) {
				console.error(err);
			} else {
				if (dbs && dbs.length > 0) {
					dbs.forEach(function (o) {
						wfs.push(o);
						if (CheckHeartbeat(o)) {
							if (o.status == 'ONLINE') {
								log = new po.SysLog('wayfinder', 'error', 'WayFinder OFFLINE  :: ' + o.uuid);
								updateSysLog(log);

								o.status = 'OFFLINE';
								o.save();
							}
						} else {
							if (o.status == 'OFFLINE') {
								log = new po.SysLog('wayfinder', 'info', 'WayFinder is now ONLINE  :: ' + o.uuid);
								updateSysLog(log);

								o.status = 'ONLINE';
								o.save();
							}
						}
					});

					if (wfs.length > 0) {
						async.mapSeries(wfs, CheckWayFinder, function (err, results) {
							if (err) {
							} else {

							}
						});
					}
				}
			}
		});
	}
	catch (ex) {

	}

};