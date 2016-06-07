/**
 * Created by Jairo Martinez on 5/17/15.
 */

process.title = 'AO_ADMIN_SVC';

global.db = require('./db');
global.po = require('../../po');

global.app = {};
global.config = {};
global.sockets = [];

var io = {};
var http = require('http');
var appInfo = {
	message: '',
	data: []
};

global.updateSysLog = function(log){
	var env = new po.Package('WYFD', 'SRVR', 0, {});
	env.contents = new po.Message('logging', 'See Attached', log);
	process.send(env);
};


var SendMsg = function (typ, o) {
	io.emit(typ, o);
};

var GetAppData = function () {
	var env = new po.Package('HTTP', 'SRVR', 0, {});

	var item = {
		id:  'HTTP',
		pid: process.pid,
		mem: 0
	};

	var j = process.memoryUsage();
	item.mem = Math.ceil((j.rss / 1024) / 1024);

	env.contents = new po.Message('util', 'App Info', item);
	process.send(env);
};

GetAppData();
setInterval(GetAppData, 5 * 60 * 1000);

function init(cfg) {
	global.config = cfg;
	global.app = require('./app')(cfg);

	var server = http.createServer(app);
	io = require('socket.io')(server);

	server.listen(global.app.get('port'), function () {
		var env = new po.Package('HTTP', 'SRVR', 0, {});
		env.contents = new po.Message('service', 'Gateway Admin Service listening on port ' + server.address().port, {});
		process.send(env);
	});

	server.on('error', function (err) {
		var env = new po.Package('HTTP', 'SRVR', 0, {});
		env.contents = new po.Message('error', 'Gateway Admin Service ERROR', err);
		process.send(env);
	});

	io.on('connection', function (socket) {
		global.sockets.push = socket;

		socket.emit('init', {status: ''});

		if(appInfo.data.length > 0){
			SendMsg('info', appInfo);
		}

		socket.on('browser', function (data) {
		});

		socket.on('disconnect', function () {
			for (var i = 0; i < global.sockets.length; i++) {
				if (socket.client.id == global.sockets[i].client.id) {
					global.sockets.splice(i, 1);
				}
			}
			//console.info('Client Disconnected -> ' + socket.client.id);
		});
	});
}

///////////////////////////////////////////////////
// Process

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down Http Service');
	process.exit();
});

process.on('message', function (msg) {
	var env = new po.Package('CTRL', msg.source, 0, {});
	switch (msg.contents.type) {
		case 'stop':
		{
			process.exit();
			break;
		}
		case 'restart':
		{
			break;
		}
		case 'logging':
		{
			SendMsg('logging', msg.contents);
			break;
		}
		case 'info':
		{
			appInfo = msg.contents;
			SendMsg('info', msg.contents);
			break;
		}
		case 'init':
		{
			init(msg.contents.data);
			break;
		}
		default:
		{
			break;
		}
	}
});