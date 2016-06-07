/**
 * Created by Jairo Martinez on 9/11/14.
 */

global.po = require('../../po');

var util = require('util');

var monitor = require('./services/monitor');

var GetAppData = function(){
	var env = new po.Package('BKUP','SRVR',0,{});

	var item = {
		id: 'BKUP',
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
	if(cfg.server.isPri){

	} else {
		monitor.init(cfg);
	}

}

///////////////////////////////////////////////////////////////////////////////////
//

process.title = 'BKUP';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down Event Service');
	process.exit();
});

process.on('message', function (msg) {
	var env = new po.Package('BKUP',msg.source,0,{});
	switch (msg.contents.type) {
		case 'stop':
		{
			process.exit();
			break;
		}
		case 'restart':
		case 'init':
		{
			init(msg.contents.data);
			env.contents = new po.Message('service','Backup Service Is Now Running',{});
			process.send(env);
			break;
		}
		case 'interval':
		{
			break;
		}
		default :
		{
			break;
		}
	}
});