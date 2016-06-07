'use strict';

/**
 * Created by Jairo Martinez on 8/3/15.
 */

var async = require('async');
var util = require('util');
var http = require('http');
var mysql = require('mysql');
var os = require('os');
var log = require('../debug');

/**
 * Local Object Type Variables
 * @type {{}}
 * @private
 */
var _comms = {};
var _cfg = {};
var _rcv = {};
var _data = {
	pclg: {},
	wyfd: {},
	ctrl: {},
	tpui: {},
	util: {},
	logs: {},
	cnfg: {}
};
var _self = {};

/**
 * Stores All Needed SQL Queries
 * @type {string[]}
 * @private
 */
var _queries = [
	'SELECT * FROM `agileoffice-gateway`.pcmonitors ORDER BY `id` DESC LIMIT 30;',
	'SELECT * FROM `agileoffice-gateway`.controllers;',
	'SELECT * FROM `agileoffice-gateway`.touchpanels;',
	'SELECT * FROM `agileoffice-gateway`.wayfinders;',
	'SELECT * FROM `agileoffice-gateway`.systemlogs ORDER BY `id` DESC LIMIT 25;'
];

/////////////////////////////////////////////////////////////////////
// Private Methods

/**
 * Collect All SQL Queries And Store In Array
 * @param cb
 * @private
 */
function _collect(cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		async.mapSeries(_queries, _query, function (err, res) {
			if (err) {
				console.error(err);
				cb(err, null);
			} else {
				_data.pclg = res[0];
				_data.ctrl = res[1];
				_data.tpui = res[2];
				_data.wyfd = res[3];
				_data.logs = res[4];

				cb(null, res);
			}
		});
	}
	catch (ex) {
		console.error(ex);
		_debug(1, 'Exception Occurred In _collect() Method');
		cb(ex, null);
	}
}

/**
 * Each Query Request To SQL Server From _collect
 * @param q
 * @param cb
 * @private
 */
function _query(q, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		_comms.query(q, function (err, dat) {
			if (err) {
				console.error(err);
				cb(null, {});
			} else {
				cb(null, dat);
			}
		});
	}
	catch (ex) {
		_debug(1, 'Exception Occurred In _query() Method');
		cb(ex, null);
	}
}

/**
 * Send Data Object To Remote Server
 * @private
 */
function _send(cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		var req = require('request');
		var opts = {
			url:     'http://' + _self.server + ':' + _self.port.toString() + '/upload',
			method:  'POST',
			timeout: 60000,
			headers: {
				'accept':          'application/json, *',
				'accept-language': 'en-US,en;q=0.8',
				'accept-charset':  'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
			},
			json:    true,
			body:    _data
		};

		if(os.type() == 'Linux'){
			opts.proxy = 'http://zeuproxy.eu.pg.com:9400';
		}

		req(opts, function (err, res, bod) {
			if (err) {
				_debug(1, 'problem with request: ' + err.message);
				cb(err,null);
			} else {
				_debug(4, JSON.stringify(bod));
				cb(null,null);
			}
		});
	}
	catch (ex) {
		_debug(1, 'Exception Occurred In _send() Method');
		cb(ex, null);
	}
}

/**
 * Check To See If Server Is Reachable
 * @param cb
 * @private
 */
function _check(cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		var req = require('request');
		var opts = {
			url:     'http://' + _self.server + ':' + _self.port.toString() + '/check',
			method:  'GET',
			timeout: 30000,
			headers: {
				'accept':          'application/json, *',
				'accept-language': 'en-US,en;q=0.8',
				'accept-charset':  'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
			}
		};

		if(os.type() == 'Linux'){
			opts.proxy = 'http://zeuproxy.eu.pg.com:9400';
		}

		req(opts, function (err, res, bod) {
			if (err) {
				_debug(1, 'problem with request: ' + err.message);
				cb(err,null);
			} else {
				_debug(4, JSON.stringify(bod));
				cb(null,null);
			}
		});
	}
	catch (ex) {
		_debug(1, 'Exception Occurred In _check() Method');
		cb(ex, null);
	}
}

/**
 * Check, Collect SQL Data, And Send
 * @private
 */
function _prep() {
	try {
		_collect(function (err, res) {
			async.waterfall([
				_check,
				_send
			], function (err, res) {
				if (err) {
					_debug(1, err);
				} else {
					_debug(3, res);
				}
			});
		});
	}
	catch (ex) {
		_debug(1, 'Exception Occurred In _prep() Method');
	}
}

/**
 * Initialize Internal Routines
 * @param cb
 * @private
 */
function _init(cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		setTimeout(_prep, 60 * 1000);

		setInterval(_prep, _self.syncIn * 60 * 1000);

		cb(null, 'OK ');
	}
	catch (ex) {
		_debug(1, 'Exception Occurred In _init() Method');
		cb(ex, null);
	}
}

/**
 * Internal Debugging
 * @param lvl
 * @param msg
 * @private
 */
function _debug(lvl, msg) {
	if (lvl == 1 || _self.debug) {
		log.UpdateConsole(lvl, 'MNTR SVC', msg);
	}
}

/////////////////////////////////////////////////////////////////////
// Public Methods

/**
 * The Core Object
 * @constructor
 */
var Monitor = function () {
	this.syncIn = 60;
	this.server = '';
	this.port = 0;
	this.debug = false;
};

/**
 * Initialize The Module With Config File
 * @param cfg
 * @param cb
 */
Monitor.prototype.init = function (cfg, cb) {
	_cfg = cfg || {};
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		this.server = _cfg.mntr.server;
		this.port = _cfg.mntr.port;
		this.syncIn = _cfg.mntr.syncIn;
		this.debug = _cfg.mntr.debug;

		_self = this;

		_comms = mysql.createConnection({
			host:     _cfg.db.ip,
			port:     _cfg.db.port,
			user:     _cfg.db.user,
			password: _cfg.db.pass,
			database: _cfg.db.schema
		});

		_comms.connect(function(err){
			if(err){
				_debug(1, err);
				cb(err, null);
			} else {
				_init(function (err, res) {
					if (err) _debug(1, err);
					cb(err, 'Initializing Monitor Service');
				});
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

/**
 * Collect The SQL Data
 * @param cb
 */
Monitor.prototype.collect = function (cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		_collect(function (err, res) {
			cb(err, res);
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

/**
 * Report The Data To The Remote Server
 * @param cb
 */
Monitor.prototype.report = function (cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		_send(function (err, res) {
			cb(err, res);
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

/**
 * Check To See If Remote Server Is Accessible
 * @param cb
 */
Monitor.prototype.check = function (cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		_check(function (err, res) {
			cb(err, res);
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

/**
 * So The Server Can Send Data Directly To Module
 * @param type
 * @param data
 * @param cb
 */
Monitor.prototype.input = function (type, data, cb) {
	cb = (typeof cb === 'function') ? cb : function () {
	};

	try {
		_debug(3, 'External Input Receive For Type "' + type + '"');
		switch (type) {
			case 'util':
			{
				_data.util = data;
				break;
			}
			case 'cnfg':
			{
				_data.cnfg = data;
				break;
			}
			default :
			{
				break;
			}
		}

		cb(null, null);
	}
	catch (ex) {
		cb(ex, null);
	}
};

/**
 * Module Export
 * @type {Monitor}
 */
module.exports = new Monitor();
