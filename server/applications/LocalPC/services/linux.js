/**
 * Created by Jairo Martinez on 9/12/14.
 */

var os = require('os');
var config = {};
var tm = 60;
var rt = {};

/////////////////////////////////////////////////////
//

var hdd = {
	total: 0,
	used:  0,
	free:  0,
	pcnt:  0
};

var mem = {
	total: 0,
	used:  0,
	free:  0,
	pcnt:  0
};

var cpu = {
	idle: 0,
	user: 0,
	sysm: 0,
	pcnt: 0
};

/////////////////////////////////////////////////////
// Private Methods

function harddrive() {
	var ps = require('child_process');
	ps.exec('df -k', function (error, stdout, stderr) {

		var lines = stdout.split("\n");
		var str_disk_info = lines[1].replace(/[\s\n\r]+/g, ' ');

		var disk_info = str_disk_info.split(' ');
		hdd.total = Math.ceil((disk_info[1] * 1024) / Math.pow(1024, 3));
		hdd.used = Math.ceil(disk_info[2] * 1024 / Math.pow(1024, 3));
		hdd.free = Math.ceil(disk_info[3] * 1024 / Math.pow(1024, 3));
		hdd.pcnt = Math.ceil(parseInt(disk_info[4]));
	});
}

function checkCpu() {
	var ps = require('child_process');
	ps.exec('sar -u 1 15', function (error, stdout, stderr) {
		var offset = 0;
		var lines = stdout.split("\n");

		for (var a in lines) {
			if (lines[a].indexOf('all') > -1) {
				var str_cpu_info = lines[a].replace(/[\s\n\r]+/g, ' ');

				var cpu_info = str_cpu_info.split(' ');

				if (cpu_info[2].indexOf('all') > -1) {
					offset = 1;
				}

				cpu.user = Math.ceil(parseFloat(cpu_info[(2 + offset)]));
				cpu.sysm = Math.ceil(parseFloat(cpu_info[(4 + offset)]));
				cpu.idle = Math.ceil(parseFloat(cpu_info[(cpu_info.length - 1)]));

				if (cpu.idle == 100) {
					cpu.pcnt = 0;
				} else {
					cpu.pcnt = Math.ceil(100 - cpu.idle);
				}
				cpu.pcnt = Math.ceil(100 - cpu.idle);
				break;
			}
		}
	});
}

function checkSysMem() {
	var ps = require('child_process');
	ps.exec('free', function (error, stdout, stderr) {

		var lines = stdout.split("\n");

		for (var a in lines) {

			if (lines[a].indexOf('Mem:') > -1) {
				var str_mem_info = lines[a].replace(/[\s\n\r]+/g, ' ');

				var mem_info = str_mem_info.split(' ');

				var ttl = mem_info[1];

				mem.total = Math.ceil((ttl * 1024) / Math.pow(1024, 2));
				mem.used = Math.ceil(mem_info[2] * 1024 / Math.pow(1024, 2));
				mem.free = Math.ceil(mem_info[3] * 1024 / Math.pow(1024, 2));
				mem.pcnt = Math.ceil((mem.used / mem.total) * 100);
			}
		}
	});
}

/////////////////////////////////////////////////////
// Public Methods

function getModel() {
	return db.PcMonitor.build({});
}

function getPcInfo() {

	var d = new Date();
	var i = os.uptime();
	var numb = (i / 60 / 60);
	var val = numb.toFixed(2);

	var info = getModel();

	info.hddinfo = getInfo('hdd');
	info.hddlevel = getLevel(hdd.pcnt);
	info.hddpcnt = getPercent('hdd');

	info.meminfo = getInfo('mem');
	info.memlevel = getLevel(mem.pcnt);
	info.mempcnt = getPercent('mem');

	info.cpuinfo = getInfo('cpu');
	info.cpulevel = getLevel(cpu.pcnt);
	info.cpupcnt = getPercent('cpu');


	info.dateTime = d;
	info.uptime = val + " Hours";

	checkSysMem();
	harddrive();
	checkCpu();

	info.save().then(
		function (s) {
		},
		function (err) {
			var log = new po.SysLog('localPc', 'error', err.message);
			updateSysLog(log);
		});

	CheckPercentages(info);
}

function CheckPercentages(info) {
	///////////////////////////////////////
	// Memory Check

	if (info.mempcnt > 90) {
		if (info.memprev < info.mempcnt) {
			info.memprev = info.mempcnt;
			UpdateSysLog(2);
		}
	} else if (info.mempcnt > 75) {
		if (info.memprev < info.mempcnt) {
			info.memprev = info.mempcnt;
			UpdateSysLog(1);
		}
	} else {
		if (info.memprev > info.mempcnt) {
			info.memprev = info.mempcnt;
		}
	}

	///////////////////////////////////////
	// HD Check

	if (info.hddpcnt > 90) {
		if (info.hddprev < info.hddpcnt) {
			info.hddprev = info.hddpcnt;
			UpdateSysLog(4);
		}
	} else if (info.hddpcnt > 75) {
		if (info.hddprev < info.hddpcnt) {
			info.hddprev = info.hddpcnt;
			UpdateSysLog(3);
		}
	}
	else {
		if (info.hddprev > info.hddpcnt) {
			info.hddprev = info.hddpcnt;
		}
	}

	///////////////////////////////////////
	// CPU Check
	if (info.cpupcnt > 90) {
		if (info.cpuprev < info.cpupcnt) {
			info.cpuprev = info.cpupcnt;
			UpdateSysLog(6);
		}
	} else if (info.cpupcnt > 75) {
		if (info.cpuprev < info.cpupcnt) {
			info.cpuprev = info.cpupcnt;
			UpdateSysLog(5);
		}
	}
	else {
		if (info.cpuprev > info.cpupcnt) {
			info.cpuprev = info.cpupcnt;
		}
	}
}

function UpdateSysLog(type) {
	var msg = 'SYSTEM IN DANGER';
	var lblLevel = 'danger';
	var level = 'error';

	switch (type) {
		case 1:
		{
			msg = 'Available Memory Very Low : ' + info.meminfo;
			lblLevel = 'warning';
			level = 'warn';
			break;
		}
		case 2:
		{
			msg = 'Available Memory Extremely Low : ' + info.meminfo;
			lblLevel = 'danger';
			level = 'error';
			break;
		}
		case 3:
		{
			msg = 'Available Hard Drive Space Very Low : ' + info.hddinfo;
			lblLevel = 'warning';
			level = 'warn';
			break;
		}
		case 4:
		{
			msg = 'Available Hard Drive Space Extremely Low : ' + info.hddinfo;
			lblLevel = 'danger';
			level = 'error';
			break;
		}
		case 5:
		{
			msg = 'CPU Activity Is Very High : ' + info.cpupcnt + '%';
			lblLevel = 'warning';
			level = 'warn';
			break;
		}
		case 6:
		{
			msg = 'CPU Activity Is Extremely High : ' + info.cpupcnt + '%';
			lblLevel = 'danger';
			level = 'error';
			break;
		}
		default:
		{
			msg = '';
			lblLevel = '';
			level = '';
			break;
		}
	}

	var log = new po.SysLog('localPc', level, msg);
	updateSysLog(log);
}

function getInfo(type) {
	switch (type) {
		case 'hdd':
			return hdd.used + " GB / " + hdd.total + " GB";
		case 'cpu':
			return cpu.user + "% / " + cpu.sysm + "% / " + cpu.idle + "%";
		case 'mem':
			return mem.used + " MB / " + mem.total + " MB";
		default:
			return '';
	}
}

function getLevel(pcnt) {
	var val = pcnt;

	if (val > 90) {
		return 'danger'
	}
	else if (val > 75) {
		return 'warning'
	}
	else if (val > 50) {
		return 'info'
	}
	else {
		return 'success'
	}
}

function getPercent(type) {
	switch (type) {
		case 'hdd':
			return hdd.pcnt;
		case 'cpu':
			return cpu.pcnt;
		case 'mem':
			return mem.pcnt;
		default:
			return 0;
	}
}

///////////////////////////////////////////////////////////////////////////

module.exports.init = function (cfg) {
	try {
		config = cfg;

		checkSysMem();
		harddrive();
		checkCpu();

		if (rt) clearInterval(rt);
		rt = setInterval(getPcInfo, tm * 1000);
	}
	catch(ex){

	}
};


