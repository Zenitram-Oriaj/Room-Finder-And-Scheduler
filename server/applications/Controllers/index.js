/**
 * Created by Jairo Martinez on 8/25/14.
 */

global.db = require('./db');
global.po = require('../../po');

var util = require('util');
var configure = require('./services/configure');
var monitor = require('./services/monitor');
var events = require('./services/events');
var cfg = {};
var app = {};
var http = {};

global.updateSysLog = function(log){
	var env = new po.Package('CTRL', 'SRVR', 0, {});
	env.contents = new po.Message('logging', 'See Attached', log);
	process.send(env);
};

var GetAppData = function(){
	var env = new po.Package('CTRL','SRVR',0,{});

	var item = {
		id: 'CTRL',
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

function init(c) {
	cfg = c;
	app = require('./app')(cfg);
	http = require('http').Server(app);

	http.listen(app.get('port'), function () {
		var env = new po.Package('CTRL', 'SRVR', 0, {});
		env.contents = new po.Message('service', 'Controller API server listening on port ' + http.address().port, {});
		process.send(env);
	});

	http.on('error', function (err) {
		var env = new po.Package('CTRL', 'SRVR', 0, {});
		env.contents = new po.Message('error', 'Controller API Service ERROR', err);
	});

	monitor.config(cfg);
	monitor.check(function(err,res){});

	setTimeout(function () {
		monitor.init(function(err,res){
			if(err){

			} else {
				events.init(cfg, function(err,res){});
			}
		});
	}, 5 * 1000);

	setInterval(function () {
		monitor.run();
	}, 10 * 60 * 1000);

	setInterval(function(){
		var dt = new Date();
		if(dt.getHours() == 1){
			monitor.init(function(err,res){
			});
		}
	}, 60 * 60 * 1000);
}

///////////////////////////////////////////////////////////////////////////////////
//
process.title = 'CTRL';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down Controller Service');
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
		case 'init':
		{
			init(msg.contents.data);
			break;
		}
		case 'update':
		{
			var ct = msg.contents.data;
			configure.update(ct, function (err, d) {
				if (err) {
					env.contents = new po.Message('results', 'Error Occurred at ' + d, err);
					process.send(env);
				} else {
					env.contents = new po.Message('results', 'Successfully Processed Controller Update', d);
					process.send(env);
				}
			});
			break;
		}
		default :
		{
			break;
		}
	}
});