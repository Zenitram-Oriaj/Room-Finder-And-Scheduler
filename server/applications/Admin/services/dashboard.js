/**
 * Created by Jairo Martinez on 8/25/14.
 */

var os = require('os');
var controllers = [];
var workspaces = [];

var queStr2 = 'SELECT * FROM `agileoffice-gateway`.pcmonitors ORDER BY `id` DESC LIMIT 1;';
var queStr3 = 'SELECT * FROM `agileoffice-gateway`.pcmonitors ORDER BY `id` DESC LIMIT 30;';

/**
 * Initialize
 * @private
 */
function _init() {
	db.Controller.findAll().then(
		function (c) {
			if (c && c.length > 0) {
				controllers = c;
			}
		},
		function (err) {
		});
}

/**
 * Get The Date Time In A Specfic String
 * @param dt
 * @returns {string}
 * @private
 */
function _getDateTimeStr(dt) {

	var yy = dt.getFullYear();
	var mm = dt.getMonth() + 1;
	var dd = dt.getDate();

	var hh = dt.getHours();
	var nn = dt.getMinutes();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;
	if (hh < 10) hh = '0' + hh;
	if (nn < 10) nn = '0' + nn;

	return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + nn + ':00';
}

/**
 * Find A Workspace
 * @param uuid
 * @returns {string}
 * @private
 */
function _findWorkspace(uuid) {
	var ws = '';
	if (controllers.length > 0) {
		controllers.forEach(function (c) {
			if (c.uuid == uuid) {
				ws = c.workspaceName;
			}
		});
	}
	return ws;
}

/**
 * Build A Temp Data Object
 * @returns {{index: number, dateTime: Date, uptime: number, hddinfo: number, hddlevel: number, meminfo: number, memlevel: number, cpuinfo: number, cpulevel: number, swpinfo: number, swplevel: number, hddpcnt: number, mempcnt: number, cpupcnt: number, swppcnt: number, pcname: *, location: *, type: *}}
 * @private
 */
function _getTempData() {
	return {
		index:    1,
		dateTime: new Date(),
		uptime:   0,
		hddinfo:  0,
		hddlevel: 0,
		meminfo:  0,
		memlevel: 0,
		cpuinfo:  0,
		cpulevel: 0,
		swpinfo:  0,
		swplevel: 0,
		hddpcnt:  0,
		mempcnt:  0,
		cpupcnt:  0,
		swppcnt:  0,
		pcname:   os.hostname(),
		location: global.config.sysLocation,
		type:     global.config.type
	};
}

_init();

/**
 * Events Request
 * @param req
 * @param res
 */
exports.events = function (req, res) {
	var ctrlEvents = [];
	var cnt = 0;
	var dt = new Date();
	dt.setHours(0, 0, 0, 0);
	var queStr1 = "SELECT * FROM `agileoffice-gateway`.controllerEvents WHERE `createdAt` >= '" + _getDateTimeStr(dt) +
		"' ORDER BY `id` DESC LIMIT 500;";

	db.sequelize.query(queStr1).then(
		function (raw) {
			var evts = raw[0];
			if (evts) {
				evts.forEach(function (c) {
					if (c && c.state) {
						cnt += 1;
						var lbl = "";
						var sts = "";

						if (c.state == 'occupied') {
							lbl = "danger";
							sts = "occupied";
						} else {
							lbl = "success";
							sts = "available ";
						}

						var ws = _findWorkspace(c.uuid);
						var item = {
							id:        cnt.toString(),
							index:     c.id,
							state:     c.state.toLowerCase(),
							duration:  c.duration,
							millis:    c.millis,
							uuid:      c.uuid,
							workspace: ws,
							date:      c.createdAt,
							label:     lbl,
							event:     c.event
						};
						ctrlEvents.push(item);
					}
				});
				res.status(200).json(ctrlEvents);
			} else {
				res.status(404).json(ctrlEvents);
			}
		},
		function (err) {
			var log = new po.SysLog('admin', 'error', 'Failed To Collect Dashboard Controller Events');
			updateSysLog(log);

			res.status(500).json(err);
		});
};

/**
 * Info Request
 * @param req
 * @param res
 */
exports.info = function (req, res) {
	db.sequelize.query(queStr2).then(
		function (raw) {
			var inf = raw[0];
			if (inf.length > 0) {
				var pc = inf[0];
				if (typeof pc.dateTime === 'undefined') {
					res.statusCode = 204;
					res.json({});
				} else {
					var item = {
						index:    1,
						dateTime: pc.dateTime,
						uptime:   pc.uptime,
						hddinfo:  pc.hddinfo,
						hddlevel: pc.hddlevel,
						meminfo:  pc.meminfo,
						memlevel: pc.memlevel,
						cpuinfo:  pc.cpuinfo,
						cpulevel: pc.cpulevel,
						swpinfo:  pc.swpinfo,
						swplevel: pc.swplevel,
						hddpcnt:  pc.hddpcnt,
						mempcnt:  pc.mempcnt,
						cpupcnt:  pc.cpupcnt,
						swppcnt:  pc.swppcnt,
						pcname:   os.hostname(),
						location: global.config.server.installed,
						type:     global.config.server.type
					};
					res.statusCode = 200;
					res.json(item);
				}
			} else {
				var l = _getTempData();
				res.statusCode = 203;
				res.json(l);
			}
		},
		function (err) {
			var log = new po.SysLog('admin', 'error', 'Failed To Collect Dashboard Information');
			updateSysLog(log);

			res.statusCode(500).json(err);
		});
};

/**
 * Server History Request
 * @param req
 * @param res
 */
exports.history = function (req, res) {
	var pcinfoEvents = [];
	db.sequelize.query(queStr3).then(
		function (raw) {
			var inf = raw[0];
			if (inf) {
				var cnt = 0;
				inf.forEach(function (pc) {
					cnt += 1;
					var item = {
						index:   cnt,
						hddPcnt: pc.hddpcnt,
						memPcnt: pc.mempcnt,
						cpuPcnt: pc.cpupcnt,
						swpPcnt: pc.swppcnt
					};
					pcinfoEvents.push(item);
				});
				res.status(200).json(pcinfoEvents);
			} else {
				res.status(404).json({});
			}
		},
		function (err) {
			var log = new po.SysLog('admin', 'error', 'Failed To Collect Dashboard History');
			updateSysLog(log);

			res.status(500).json(err);
		});
};