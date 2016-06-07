/**
 * Created by Jairo Martinez on 8/25/14.
 */


const collect = 0;
const create = 1;
const update = 2;
const destroy = 3;

var log = {};

function _findWS(uuid, cb) {
	db.Workspace
		.find({where: {uuid: uuid}})
		.then(
		function (w) {
			cb(null,w);
		},
		function (err) {
			cb(err,null);
		});
}

function _findCT(o, cb) {
	db.Controller
		.find({where: {uuid: o.uuid}})
		.then(
		function (cts) {
			if (cts) {
				cb(cts);
			} else {
				log = new po.SysLog('admin', 'warning', 'Unable To Locate Controller :: ' + o.uuid);
				updateSysLog(log);

				cb(null);
			}
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Find Controller :: ' + o.uuid);
			updateSysLog(log);

			cb(err);
		});
}

function _build(req) {
	return db.Controller.build({
		uuid:          req.body.uuid,
		workspaceUuid: req.body.workspaceUuid,
		workspaceName: req.body.workspaceName,
		floorId:       req.body.floorId,
		locationId:    req.body.locationId,
		description:   req.body.description,
		timeout:       req.body.timeout,
		heartbeat:     req.body.heartbeat,
		mode:          req.body.mode,
		ip:            req.body.ip,
		port:          req.body.port,
		gw:            req.body.gw,
		subnet:        req.body.subnet,
		dns:           req.body.dns
	});
}

function _save(ct, cb) {
	var r = new po.Result();

	_findWS(ct.workspaceUuid, function (err,w) {
		if(err){
			log = new po.SysLog('admin', 'error', 'Controller Has NOT Been Added :: ' + ct.uuid);
			updateSysLog(log);

			r.code = 500;
			r.message = 'FAILED To Find Workspace';
			r.data = err;
			cb(r);
		} else {
			ct.workspaceName = w.name;
			ct.floorId = w.floorId;
			ct.locationId = w.locationId;

			ct.save().then(
				function (s) {
					log = new po.SysLog('admin', 'success',  'Controller Has Been Added :: ' + ct.uuid);
					updateSysLog(log);

					r.code = 201;
					r.message = 'Added New Controller';
					r.data = s;
					cb(r);
				},
				function (err) {
					log = new po.SysLog('admin', 'error', 'Controller Has NOT Been Added :: ' + ct.uuid);
					updateSysLog(log);

					r.code = 500;
					r.message = 'FAILED To Added Controller';
					r.data = err;
					cb(r);
				});
		}
	});
}

function _update(o, c, cb) {
	var r = new po.Result();
	var env = new po.Package('HTTP', 'CTRL', 0, {});

	if (c.name != o.name) c.name = o.name;

	if(o.description) c.description = o.description;
	else c.description = '-';

	if (c.timeout != o.timeout) c.timeout = o.timeout;
	if (c.mode != o.mode) c.mode = o.mode;

	if (c.ip != o.ip) c.ip = o.ip;
	if (c.port != o.port) c.port = o.port;
	if (c.gw != o.gw) c.gw = o.gw;
	if (c.subnet != o.subnet) c.subnet = o.subnet;
	if (c.dns != o.dns) c.dns = o.dns;

	c.workspaceUuid = o.workspaceUuid;

	_findWS(o.workspaceUuid, function(err,w){
		if(err){
			c.workspaceName = '';
			c.floorId = '';
			c.locationId = '';
			c.regionId = '';
		} else {
			c.workspaceName = w.name || '';
			c.floorId = w.floorId || '';
			c.locationId = w.locationId || '';
			c.regionId = w.regionId || '';
		}

		env.contents = new po.Message('update', 'Request To Update Controller', c);
		process.send(env);

		c.save().then(
			function (s) {
				log = new po.SysLog('admin', 'success', 'Controller Has Been Updated :: ' + c.uuid);
				updateSysLog(log);

				r.code = 200;
				r.message = 'Updated Controller';
				r.data = s;
				cb(r);
			},
			function (err) {
				log = new po.SysLog('admin', 'error', 'Failed To Update Controller :: ' + c.uuid);
				updateSysLog(log);

				r.code = 500;
				r.message = 'Failed To Update Controller';
				r.data = err;
				cb(r)
			});
	});
}

function _remove(c, cb) {
	var r = new po.Result();
	c.destroy().then(
		function (result) {
			log = new po.SysLog('admin', 'success', 'Controller Has Been Deleted :: ' + c.uuid);
			updateSysLog(log);

			r.code = 200;
			r.message = 'Deleted Controller From Database';
			r.data = c;
			cb(r);
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Delete Controller :: ' + c.uuid);
			updateSysLog(log);

			r.code = 500;
			r.message = 'Failed To Delete Controller';
			r.data = err;
			cb(r);
		});
}

function _process(req, cmd, cb) {
	var r = new po.Result();
	var o = {};

	if (cmd > collect) {
		o = _build(req);

		_findCT(o, function (c) {
			switch (cmd) {
				case create:
				{
					if (c === null) {
						_save(o, function (m) {
							r = m;
							cb(r);
						})
					} else {
						r.code = 409;
						r.message = 'Controller Already Exists';
						cb(r);
					}
					break;
				}
				case update:
				{
					if (c != null) {
						_update(o, c, function (m) {
							r = m;
							cb(r);
						});
					} else {
						r.code = 404;
						r.message = 'Was Not Able To Locate Controller';
						cb(r);
					}
					break;
				}
				case destroy:
				{
					if (o != null) {
						_remove(c, function (m) {
							r = m;
							cb(r);
						});
					} else {
						r.code = 409;
						r.message = 'Was Not Able To Locate Controller';
						cb(r);
					}
					break;
				}
				default:
				{
					break;
				}
			}
		});
	} else {

	}
}

////////////////////////////////////////////////////////
// HTTP Functions

exports.get = function (req, res) {
	try {
		db.Controller
			.findAll()
			.then(
			function (c) {
				if (c) {
					res.status(200).json(c);
				} else {
					res.status(404).json(null);
				}
			},
			function (err) {
				log = new po.SysLog('admin', 'error', 'Failed To Collect All Controllers From DB');
				updateSysLog(log);

				res.status(500).json(err);
			});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

exports.fetch = function (req, res) {
	try {
		var c = db.Controller.build();
		res.status(200).json(c);
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

exports.create = function (req, res) {
	try {
		_process(req, create, function (r) {
			res.status(r.code).json(r);
		});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

exports.update = function (req, res) {
	try {
		_process(req, update, function (r) {
			res.status(r.code).json(r);
		});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};

exports.remove = function (req, res) {
	try {
		_process(req, destroy, function (r) {
			res.status(r.code).json(r);
		});
	}
	catch (ex) {
		res.status(500).json(ex);
	}
};