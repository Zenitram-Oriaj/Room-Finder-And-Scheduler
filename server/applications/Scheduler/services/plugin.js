/**
 * Created by Jairo Martinez on 10/14/14.
 */

var async = require('async');
var path = require('path');
var rs = null;
var tic = {};
var config = {};

function buildRSList(cb) {
	var ws = [];
	db.Workspace
		.findAll({where: ["reservable > ?", 0]})
		.then(
		function (c) {
			if (c) {
				for (var i in c) {
					ws.push(c[i].reserveId);
				}
			} else {
				var log = new po.SysLog('scheduler', 'warning', 'Did Not Find Any Reservation IDs > 0');
				updateSysLog(log);
			}
			cb(null,ws);
		},
		function (err) {
			console.error('db.Workspace.find ERROR: ' + err.message);
			cb(err,null);
		});
}

function ResetTable(cb) {
	db.sequelize
		.query("DELETE FROM `agileoffice-gateway`.reservations WHERE id > 0;")
		.then(
		function (res) {
			db.sequelize
				.query("ALTER TABLE `agileoffice-gateway`.reservations AUTO_INCREMENT = 1;")
				.then(
				function (result) {
					cb(null, result);
				},
				function (err) {
					console.error('ERROR ON AUTO_INCREMENT OCCURRED FOR RESERVATIONS TABLE :: ' + err.message);
					cb(err, null);
				});
		},
		function (err) {
			var log = new po.SysLog('scheduler', 'warning', 'ERROR ON CLEARING RESERVATIONS TABLE :: ' + err.message);
			updateSysLog(log);
			cb(err, null);
		});
}

function collect() {
	ResetTable(function (err, res) {
		if (err) {

		} else {
			buildRSList(function (err,res) {
				var ws = res;
				if (ws.length > 0) {
					rs.collect(ws, function (err, res) {
						if(err){

						} else {

						}
					});
				}
			});
		}
	});
}

function setPluginType(id) {
	switch (id) {
		case 1:
		{
			rs = require('../../../modules/scheduling/resourceScheduler');
			break;
		}
		case 2:
		{
			rs = require('groupwise');
			break;
		}
		case 3:
		{
			rs = require('exchange');
			break;
		}
		case 4:
		{
			rs = require('googleCal');
			break;
		}
		default :
		{
			break;
		}
	}
}

function init(cfg, cb) {
	config = cfg;

	setPluginType(cfg.schd.typeId);
	if (rs) {
		rs.init(cfg, function (err, res) {
			if (err) {
				cb(err, null);
			} else {
				collect();
				tic = setInterval(collect, 5 * 60 * 1000); // Check Every 5 minutes.
				cb(null, res)
			}
		});
	} else {
		cb('NO Scheduler Define For Plugin To Use', null);
	}
}

module.exports.init = init;

module.exports.collect = function () {
	var c = config;
	clearInterval(tic);
	init(c, function (err, res) {
		if (err) {
			console.error(err);
		}
	});
};

module.exports.cancel = function () {
	clearInterval(tic);
};

