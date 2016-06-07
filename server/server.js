#!/usr/bin/env node

var fs = require('fs');
var serverCfg = {};

try {
	fs.openSync(__dirname + "/configs/gateway.json", 'r');
	serverCfg = JSON.parse(fs.readFileSync(__dirname + "/configs/gateway.json"));
}
catch (err) {
	serverCfg = JSON.parse(fs.readFileSync(__dirname + "/configs/default.json"));
}

// Initialize Core Server
///////////////////////////////////////////////////////////////////////////////////

const totalApps = 8;

global.db = require('./db');
global.po = require('./po');

var log = require('./modules/debug');
var util = require('util');
var dns = require('dns');
var server = require('child_process');
var netCfg = require('./modules/netConfig');
var monitor = require('./modules/monitor');

//var monitor = new Monitor();

var apps = [];
var initialLoad = false;
var startUpIntv = {};

var httpService = {};
var dscvService = {};
var ctrlService = {};
var pclgService = {};
var bkupService = {};
var wyfdService = {};
var schdService = {};
var termService = {};
var altcService = {};

var appInfo = [];

var appName = [
	'CTRL',
	'HTTP',
	'WYFD',
	'SCHD',
	'BKUP',
	'PCLG',
	'DSCV',
	'ALTC',
	'TERM',
	'SRVR'
];

function utilization(inf) {
	for (var i in appInfo) {
		if (appInfo[i].id == inf.id) {
			appInfo[i].pid = inf.data.pid;
			appInfo[i].mem = inf.data.mem;
			break;
		}
	}
}

function SendAppInfo() {
	var dt = new Date();
	var contents = new po.Message('info', dt.toISOString, appInfo);
	var env = new po.Package('SRVR', 'HTTP', 0, contents);
	router(env);

	monitor.input('util',appInfo,function(err,res){

	});
}

function ServerInfo() {
	var j = process.memoryUsage();
	var m = j.rss;
	var mem = Math.ceil((m / 1024) / 1024);

	var item = {
		id:  'SRVR',
		pid: process.pid,
		mem: mem
	};
	utilization({id: item.id, data: item});
}

setInterval(ServerInfo, 5 * 60 * 1000);

setTimeout(function () {
	SendAppInfo();
	setInterval(SendAppInfo, 5 * 60 * 1000);
}, 60 * 1000);

function init() {
	log.UpdateSysLog('server', 'info', 'Gateway Server Started');
	log.UpdateConsole(4, 'SRVR SVC', 'Running Init Routine');

	// Fetch the computer's mac address

	for (var i = 0; i < appName.length; i++) {
		var item = {
			id:  appName[i],
			pid: 0,
			mem: 0
		};
		appInfo.push(item);
	}

	ServerInfo();

	netCfg.updateConfig(serverCfg, function (cfg) {
		serverCfg = cfg;
		var dt = new Date();
		serverCfg.updatedAt = dt.toISOString();
		serverCfg.server.node = process.versions.node;
		serverCfg.server.v8 = process.versions.v8;
		serverCfg.server.arch = process.arch;
		serverCfg.server.pid = process.pid;

		if (process.getuid) {
			serverCfg.server.uid = process.getuid();
		}

		require('getmac').getMac(function (err, macAddress) {
			if (err)  console.error(err);
			serverCfg.network.mac = macAddress;
			var a = macAddress.split(':');
			var uuid = '';
			for (var i in a) {
				a[i] = a[i].toUpperCase();
				uuid += a[i];
			}
			serverCfg.server.uuid = uuid;

			var j = JSON.stringify(serverCfg, null, 2);

			fs.writeFile(__dirname + '/configs/gateway.json', j, function (err) {
				if (err) {
					log.UpdateSysLog('server', 'error', 'Failed To Save Gateway Config File');
				} else {
					log.UpdateSysLog('server', 'success', 'Saved Config File - Initial Load');
				}
			});
		});

		if (initialLoad == false) {
			AdminService();
		} else {
			log.UpdateSysLog('server', 'warning', 'HTTP Service Is Already Loaded');
		}

		setTimeout(function () {
			if (startUpIntv) clearInterval(startUpIntv);
			StartApps();
		}, 1000);

		setTimeout(function(){
			if(serverCfg.mntr.enabled){
				monitor.init(cfg, function(err,res){
					if(err){
						log.UpdateConsole(1, 'MNTR SVC', err);
					} else {
						log.UpdateConsole(4, 'MNTR SVC', res);
					}
					monitor.input('cnfg',serverCfg,function(err,res){});
				});
			} else {
				log.UpdateConsole(2, 'MNTR SVC', 'Monitoring Service Is Disabled');
				log.UpdateSysLog('server', 'warning', 'Monitoring Service Is Disabled');
			}
		}, 10 * 1000);

	});
}

function openPackage(pckg) {
	switch (pckg.contents.type) {
		case 'logging':
		{
			var dat = pckg.contents.data;
			log.UpdateSysLog(dat.evt, dat.lvl, dat.msg);
			break;
		}
		case 'console':
		{
			log.UpdateConsole(4, pckg.source + ' SVC', pckg.contents.message);
			break;
		}
		case 'service':
		{
			log.UpdateConsole(4, pckg.source + ' SVC', pckg.contents.message);
			break;
		}
		case 'error':
		{
			log.UpdateConsole(1, pckg.source + ' ERR', pckg.contents.message);
			log.UpdateSysLog('server', 'error', pckg.contents.message);
			break;
		}
		case 'restart':
		{
			break;
		}
		case 'util':
		{
			var p = {
				id:   pckg.source,
				data: pckg.contents.data
			};
			utilization(p);
			break;
		}
		case 'configs':
		{
			serverCfg = pckg.contents.data;
			var dt = new Date();
			serverCfg.updatedAt = dt.toISOString();

			var restart = serverCfg.restart;
			serverCfg.restart = false;

			monitor.input('cnfg',serverCfg,function(err,res){});

			var j = JSON.stringify(pckg.contents.data, null, 2);
			fs.writeFile(__dirname + pckg.contents.message, j, function (err) {
				if (err) {
					log.UpdateSysLog('server', 'error', 'Failed To Save Gateway Config File');
				} else {
					if (restart) {
						log.UpdateConsole(4, 'SRVR SVC', 'Saved Config File - Restarting Services');
						log.UpdateSysLog('server', 'success', 'Saved Config File - Restarting Services');
						RestartApps();
					} else {
						log.UpdateSysLog('server', 'success', 'Saved Config File - NO RESTART');
					}
				}
			});
			break;
		}
		default:
		{
			break;
		}
	}
}

function router(pckg) {
	try{
		switch (pckg.destination) {
			case 'CTRL': ctrlService.send(pckg); break;
			case 'HTTP': httpService.send(pckg); break;
			case 'WYFD': wyfdService.send(pckg); break;
			case 'SCHD': schdService.send(pckg); break;
			case 'BKUP': bkupService.send(pckg); break;
			case 'PCLG': pclgService.send(pckg); break;
			case 'DSCV': dscvService.send(pckg); break;
			case 'ALTC': altcService.send(pckg); break;
			case 'TERM': termService.send(pckg); break;

			case 'SRVR':
			default : openPackage(pckg); break;
		}
	}
	catch(ex){
		log.UpdateSysLog('server', 'error', 'Exception Occurred In Router Method :: ' + ex);
		log.UpdateConsole(1, 'HTTP ERR', 'Administration Service Has Stopped Running');
	}
}

function AdminService() {
	var env = new po.Package('SRVR', 'HTTP', 0, {});

	httpService = server.fork(__dirname + "/applications/Admin");
	httpService.name = 'HTTP';

	httpService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Administration Service Has Stopped Running');
		log.UpdateConsole(1, 'HTTP ERR', 'Administration Service Has Stopped Running');
		RestartApp(httpService);
	});

	httpService.on('message', function (msg) {
		router(msg);
	});

	env.contents = new po.Message('init', '', serverCfg);
	httpService.send(env);
}

function DiscoveryService(idx) {
	var env = new po.Package('SRVR', 'DSCV', 0, {});

	dscvService = server.fork(__dirname + "/applications/Discovery");

	dscvService.name = 'DSCV';
	dscvService.case = idx;

	dscvService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Discovery Service Has Stopped Running');
		log.UpdateConsole(1, 'DSCV ERR', 'Discovery Service Has Stopped Running');
		RestartApp(dscvService);
	});

	dscvService.on('message', function (msg) {
		router(msg);
	});
	apps.push(dscvService);

	env.contents = new po.Message('init', '', serverCfg);
	dscvService.send(env);
}

function ControllerService(idx) {
	var env = new po.Package('SRVR', 'CTRL', 0, {});

	ctrlService = server.fork(__dirname + "/applications/Controllers");

	ctrlService.name = 'CTRL';
	ctrlService.case = idx;

	ctrlService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Controller Service Has Stopped Running');
		log.UpdateConsole(1, 'CTRL ERR', 'Controller Service Has Stopped Running');
		RestartApp(ctrlService);
	});

	ctrlService.on('message', function (msg) {
		router(msg);
	});
	apps.push(ctrlService);

	env.contents = new po.Message('init', '', serverCfg);
	ctrlService.send(env);
}

function LocalPcService(idx) {
	var env = new po.Package('SRVR', 'PCLG', 0, {});

	pclgService = server.fork(__dirname + "/applications/LocalPC");

	pclgService.name = 'PCLG';
	pclgService.case = idx;

	pclgService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'LocalPC Service Has Stopped Running');
		log.UpdateConsole(1, 'PCLG ERR', 'LocalPC Service Has Stopped Running');
		RestartApp(pclgService);
	});

	pclgService.on('message', function (msg) {
		router(msg);
	});
	apps.push(pclgService);

	env.contents = new po.Message('init', '', serverCfg);
	pclgService.send(env);
}

function BackupService(idx) {
	var env = new po.Package('SRVR', 'BKUP', 0, {});

	bkupService = server.fork(__dirname + "/applications/Backup");

	bkupService.name = 'BKUP';
	bkupService.case = idx;

	bkupService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Backup Service Has Stopped Running');
		log.UpdateConsole(1, 'CKUP ERR', 'Backup Service Service Has Stopped Running');
		RestartApp(bkupService);
	});

	bkupService.on('message', function (msg) {
		router(msg);
	});
	apps.push(bkupService);

	env.contents = new po.Message('init', '', serverCfg);
	bkupService.send(env);
}

function WayFinderService(idx) {
	var env = new po.Package('SRVR', 'WYFD', 0, {});

	wyfdService = server.fork(__dirname + "/applications/WayFinder");

	wyfdService.name = 'WYFD';
	wyfdService.case = idx;

	wyfdService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'WayFinder Service Has Stopped Running');
		log.UpdateConsole(1, 'WYFD ERR', 'WayFinder Service Has Stopped Running');
		RestartApp(wyfdService);
	});

	wyfdService.on('message', function (msg) {
		router(msg);
	});
	apps.push(wyfdService);

	env.contents = new po.Message('init', '', serverCfg);
	wyfdService.send(env);
}

function SchedulerService(idx) {
	var env = new po.Package('SRVR', 'SCHD', 0, {});

	schdService = server.fork(__dirname + "/applications/Scheduler");

	schdService.name = 'SCHD';
	schdService.case = idx;

	schdService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Scheduler Service Has Stopped Running');
		log.UpdateConsole(1, 'SCHD ERR', 'Scheduler Service Has Stopped Running');
		RestartApp(schdService);
	});

	schdService.on('message', function (msg) {
		router(msg);
	});
	apps.push(schdService);

	env.contents = new po.Message('init', '', serverCfg);
	schdService.send(env);
}

function AnalyticsService(idx) {
	var env = new po.Package('SRVR', 'ALTC', 0, {});

	altcService = server.fork(__dirname + "/applications/Analytics");

	altcService.name = 'ALTC';
	altcService.case = idx;

	altcService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Analytics Service Has Stopped Running');
		log.UpdateConsole(1, 'WYFD ERR', 'Analytics Service Has Stopped Running');
		RestartApp(altcService);
	});

	altcService.on('message', function (msg) {
		router(msg);
	});
	apps.push(altcService);

	env.contents = new po.Message('init', '', serverCfg);
	altcService.send(env);
}

function TerminalService(idx) {
	var env = new po.Package('SRVR', 'TERM', 0, {});

	termService = server.fork(__dirname + "/applications/Terminal");

	termService.name = 'TERM';
	termService.case = idx;

	termService.on('exit', function () {
		log.UpdateSysLog('server', 'error', 'Terminal Service Has Stopped Running');
		log.UpdateConsole(1, 'TERM ERR', 'Terminal Service Has Stopped Running');
		RestartApp(termService);
	});

	termService.on('message', function (msg) {
		router(msg);
	});
	apps.push(termService);

	env.contents = new po.Message('init', '', serverCfg);
	termService.send(env);
}

function Applications(i) {
	switch (i) {
		case 1:
		{
			if (serverCfg.pclg.enabled) {
				LocalPcService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'LocalPC Service Is Disabled');
			}
			break;
		}
		case 2:
		{
			if (serverCfg.dscv.enabled && serverCfg.server.isPri) {
				DiscoveryService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'Discovery Service Is Disabled');
			}
			break;
		}
		case 3:
		{
			if (serverCfg.term.enabled) {
				TerminalService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'Terminal Service Is Disabled');
			}
			initialLoad = true;
			break;
		}
		case 4:
		{
			if (serverCfg.ctrl.enabled && serverCfg.server.isPri) {
				ControllerService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'Controller Service Is Disabled');
			}
			break;
		}
		case 5:
		{
			if (serverCfg.schd.enabled && serverCfg.server.isPri) {
				SchedulerService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'Scheduler Service Is Disabled');
			}
			break;
		}
		case 6:
		{
			if (serverCfg.wyfd.enabled && serverCfg.server.isPri) {
				WayFinderService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'WayFinder Service Is Disabled');
			}
			break;
		}
		case 7:
		{
			if (serverCfg.bkup.enabled) {
				BackupService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'Backup Service Is Disabled');
			}
			break;
		}
		case 8:
		{
			if (serverCfg.altc.enabled && serverCfg.server.isPri) {
				AnalyticsService(i);
			} else {
				log.UpdateSysLog('server', 'warning', 'Analytics Service Is Disabled');
			}
			initialLoad = true;
			break;
		}

		default:
		{
			break;
		}
	}
}

function StartApps() {
	var i = 0;
	startUpIntv = setInterval(function () {
		i++;
		if (i > totalApps) {
			clearInterval(startUpIntv);
		} else {
			Applications(i);
		}
	}, 5000);
}

function RestartApp(svc) {
	/*
	 connected: false,
	 signalCode: null,
	 exitCode: 8,
	 */

	if (svc.name === 'HTTP') {
		httpService = null;
		AdminService();
	} else {
		for (var i in apps) {
			if(apps[i].name === svc.name){
				var a = apps[i].case;
				apps.splice(i,0);
				svc = null;
				Applications(a);
				break;
			}
		}
	}
}

function RestartApps() {
	apps.forEach(function (worker) {
		worker.kill();
	});

	if (startUpIntv) {
		clearInterval(startUpIntv);
	}

	apps.length = 0;
	setTimeout(StartApps, 2000);
}

function RestartAll() {

	httpService.kill();

	apps.forEach(function (worker) {
		worker.kill();
	});

	if (startUpIntv) {
		clearInterval(startUpIntv);
	}

	apps.length = 0;
	setTimeout(AdminService, 500);
	setTimeout(StartApps, 2000);
}

init();

//////////////////////////////////////////////////////////////////
//

process.title = 'SRVR';

process.on('exit', function () {
	apps.forEach(function (worker) {
		worker.kill();
	});
});


