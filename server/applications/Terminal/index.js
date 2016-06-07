/**
 * Created by Jairo Martinez on 6/12/15.
 */

var po = require('../../po');
var config = {};

var GetAppData = function(){
	var env = new po.Package('TERM','SRVR',0,{});

	var item = {
		id: 'TERM',
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
	config = cfg;
	var tty = require('tty.js');
	var app = tty.createServer(cfg.term);

	app.get('/term', function(req, res, next) {
		res.send('');
	});
	app.listen();
}

///////////////////////////////////////////////////////////////////////////////////
//

process.title = 'TERM';

process.on('disconnect', function () {
	console.log('Parent Closed Channel - Shutting Down Analytics Service');
	process.exit();
});

process.on('message', function (msg) {
	var env = new po.Package('TERM',msg.source,0,{});
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
			config = msg.contents.data;
			env.contents = new po.Message('service','Terminal Service Is Now Running On Port ' + config.term.port.toString(),{});
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