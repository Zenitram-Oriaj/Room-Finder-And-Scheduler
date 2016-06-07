/**
 * Created by Jairo Martinez on 8/25/14.
 */

global.db = require('./db');
global.po = require('../../po');

global.cfg = {};
global.sockets = [];

var http = require('http');
var util = require('util');

var configure = require('./services/configure');
var monitor = require('./services/monitor');

var io = {};
var app = {};

global.updateSysLog = function(log){
	var env = new po.Package('WYFD', 'SRVR', 0, {});
	env.contents = new po.Message('logging', 'See Attached', log);
	process.send(env);
};

var SendMsg = function (typ, o) {
	io.emit(typ, o);
};

global.reqUpdate = function () {
	var env = new po.Package('WYFD', 'SCHD', 0, {});
	env.contents = new po.Message('collect', '', {});
	process.send(env);
};

var GetAppData = function(){
	var env = new po.Package('WYFD','SRVR',0,{});

	var item = {
		id: 'WYFD',
		pid: process.pid,
		mem: 0
	};

	var j = process.memoryUsage();
	item.mem = Math.ceil((j.rss / 1024) / 1024);

	env.contents = new po.Message('util','App Info',item);
	process.send(env);
};

GetAppData();
setInterval(GetAppData, 5 * 60 * 1000);

function init(cfg) {
	global.cfg = cfg;
	app = require('./app')(cfg);

	var server = http.createServer(app);
	io = require('socket.io')(server);

	server.listen(app.get('port'), function () {
		var env = new po.Package('WYFD', 'SRVR', 0, {});
		env.contents = new po.Message('service', 'WayFinder Service listening on port ' + server.address().port, {});
		process.send(env);
	});

	server.on('error', function (err) {
		var env = new po.Package('WYFD', 'SRVR', 0, {});
		env.contents = new po.Message('error', 'WayFinder Service ERROR', err);
	});

	setTimeout(function(){
		monitor.init();
	}, 5000);

	setInterval(function () {
		monitor.run();
	}, 10 * 60 * 1000);

	configure.run();

	io.on('connection', function (socket) {
		global.sockets.push = socket;

		socket.emit('init', {status: ''});

		socket.on('register', function (data) {
		});

		socket.on('disconnect', function () {

			for (var i = 0; i < global.sockets.length; i++) {
				if (socket.client.id == global.sockets[i].client.id) {
					global.sockets.splice(i, 1);
				}
			}

			db.WayFinder.findAll().then(
				function (wf) {
					if(wf && wf.length > 0){
						for(var i in wf){
							if(wf[i].ip == socket.client.conn.remoteAddress) {
								var log = new po.SysLog('wayfinder', 'error', 'Client Disconnected From IO Service :: ' + wf[i].uuid);
								updateSysLog(log);
								break;
							}
						}
					}
				},
				function (err) {});
		});
	});

	setTimeout(function(){
		SendMsg('refresh', {});
	}, 5 * 1000);
}

///////////////////////////////////////////////////////////////////////////////////
//

process.title = 'WYFD';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down WayFinder Service');
	process.exit();
});

process.on('message', function (msg) {
	var env = new po.Package('WYFD', msg.source, 0, {});
	switch (msg.contents.type) {
		case 'stop':
		{
			process.exit();
			break;
		}
		case 'refresh': {
			SendMsg('refresh',{});
			break;
		}
		case 'restart':
		case 'init':
		{
			init(msg.contents.data);
			break;
		}
		default :
			break;
	}
});