/**
 * Created by Jairo Martinez on 8/25/14.
 */

global.cfg = {};
global.db = require('./db');
global.po = require('../../po');

var schedule = {};
var env = {};

global.updateSysLog = function (log) {
	var env = new po.Package('SCHD', 'SRVR', 0, {});
	env.contents = new po.Message('logging', 'See Attached', log);
	process.send(env);
};

var GetAppData = function () {
	env = new po.Package('SCHD', 'SRVR', 0, {});

	var item = {
		id:  'SCHD',
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
	try {
		global.cfg = cfg;
		if (cfg.schd.external) {
			schedule = require('./services/plugin');
		} else {
			schedule = require('./services/local');
		}
	}
	catch (ex) {
		env = new po.Package('SCHD', 'SRVR', 0, {});
		env.contents = new po.Message('error', 'Scheduler Init Service (S1) Had An Exception', ex);
		process.send(env);
	}

	try {
		schedule.init(cfg, function (err, res) {
			if (err) {
				env = new po.Package('SCHD', 'SRVR', 0, {});
				env.contents = new po.Message('error', 'Scheduler Init Service (S2) Had An Error: ', JSON.stringify(err));
			} else {
				env = new po.Package('SCHD', 'SRVR', 0, {});
				env.contents = new po.Message('service', 'Scheduler Service Is Now Running', res);
			}
			process.send(env);
		});
	}
	catch(ex){
		env = new po.Package('SCHD', 'SRVR', 0, {});
		env.contents = new po.Message('error', 'Scheduler Init Service (S2) Had An Exception', JSON.stringify(ex));
		process.send(env);
	}
}

///////////////////////////////////////////////////////////////////////////////////
//

process.title = 'SCHD';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down Scheduler Service');
	process.exit();
});

process.on('message', function (msg) {

	switch (msg.contents.type) {
		case 'stop':
		{
			process.exit();
			break;
		}
		case 'init':
		{
			init(msg.contents.data);
			break;
		}
		case 'collect':
		{
			schedule.collect();
			break;
		}
		default:
			break;
	}
});
