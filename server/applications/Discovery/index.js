/**
 * Created by Jairo Martinez on 8/26/14.
 */

global.db = require('./db');
global.po = require('../../po');

var broadcast = require('./services/broadcast');
var discover = require('./services/discover');
var configure = require('./services/configure');
var util = require('util');

var config = {};
var timer = {};

global.updateSysLog = function(log){
	var env = new po.Package('WYFD', 'SRVR', 0, {});
	env.contents = new po.Message('logging', 'See Attached', log);
	process.send(env);
};

function runConfigure(){
	clearTimeout(timer);
	timer = setTimeout(function(){
		configure.run(config);
	},5 * 1000);
}

var GetAppData = function(){
	var env = new po.Package('DSCV','SRVR',0,{});

	var item = {
		id: 'DSCV',
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

function init(cfg, cb){
	discover.run();
	broadcast.run(cfg);
	runConfigure();
	cb();
}

discover.on('newIPS', function(){
	runConfigure();
});

discover.on('error', function(err){
	var env = new po.Package('DSCV','SRVR',0,{});
	env.contents = new po.Message('error','Discovery Service ERROR',err);
});

/////////////////////////////////////////////////////////////////////////////
//

process.title = 'DSCV';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down Discovery Service');
	process.exit();
});

process.on('message', function (msg) {
	var env = new po.Package('DSCV',msg.source,0,{});
	switch (msg.contents.type) {
		case 'stop':{
			process.exit();
			break;
		}
		case 'restart':{
			break;
		}
		case 'init':{
			config = msg.contents.data;
			init(config, function(){
				env.contents = new po.Message('service','Discovery Service Is Now Running',{});
				process.send(env);
			});
			break;
		}
		default: {
			break;
		}
	}
});