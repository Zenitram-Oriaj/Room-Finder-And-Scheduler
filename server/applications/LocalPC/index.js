/**
 * Created by Jairo Martinez on 8/25/14.
 */
// Clear memory on Linux Box - Requires sudo su
// sync echo 3 > /proc/sys/vm/drop_caches

global.db = require('./db');
global.po = require('../../po');

var monitoring = {};
var os = require('os');
var util = require('util');

var tm = 60;
var rt = {};

global.updateSysLog = function(log){
	var env = new po.Package('PCLG', 'SRVR', 0, {});
	env.contents = new po.Message('logging', 'See Attached', log);
	process.send(env);
};

var GetAppData = function(){
	var env = new po.Package('PCLG','SRVR',0,{});

	var item = {
		id: 'PCLG',
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

function init(cfg){
	var env = new po.Package('PCLG','SRVR',0,{});

	if(os.type() == 'Linux'){
		monitoring = require('./services/linux');
	}
	else if(os.type() == 'Darwin'){
		monitoring = require('./services/macosx');
	}

	monitoring.init(cfg);

	env.contents = new po.Message('service','Local PC Service Is Now Running',{});
	process.send(env);
}

///////////////////////////////////////////////////////////////////////////////////
//

process.title = 'PCLG';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down LocalPC Service');
	process.exit();
});

process.on('message', function (msg) {
	switch (msg.contents.type) {
		case 'stop': {
			process.exit();
			break;
		}
		case 'restart':
		case 'init': {
			init(msg.contents.data);
			break;
		}
		case 'interval': {
			clearInterval(rt);
			tm = parseInt(msg.val);
			rt = setInterval(function(){}, tm * 1000);
			break;
		}
		default: {
			break;
		}
	}
});