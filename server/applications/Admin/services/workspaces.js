/**
 * Created by Jairo Martinez on 8/25/14.
 */

const collect = 0;
const create = 1;
const update = 2;
const destroy = 3;
var log = {};

function saveWorkspace(ws, cb) {
	var r = new po.Result();
	ws.save().then(
		function (s) {
			log = new po.SysLog('admin', 'success', 'Added New Workspace :: ' + ws.name);
			updateSysLog(log);

			r.code = 200;
			r.message = 'Added New Workspace';
			r.data = ws;
			cb(r);
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Add New Workspace :: ' + ws.name);
			updateSysLog(log);
			r.code = 500;
			r.message = 'Unable To Add Workspace';
			r.data = err;
			cb(r);
		});
}

function updateWorkspace(ws, c, cb) {
	var r = new po.Result();
	c.name = ws.name;
	c.description = ws.description;
	c.type = ws.type;
	c.reservable = ws.reservable;
	c.reserveId = ws.reserveId;
	c.allowLocal = ws.allowLocal;
	c.floorId = ws.floorId;
	c.locationId = ws.locationId;

	c.save().then(
		function (res) {
			log = new po.SysLog('admin', 'success', 'Updated Workspace :: ' + c.name);
			updateSysLog(log);

			r.code = 200;
			r.message = 'Updated Workspace';
			r.data = res;
			cb(r);
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Update Workspace :: ' + c.name);
			updateSysLog(log);

			r.code = 500;
			r.message = 'Failed To Update Workspace';
			r.data = err;
			cb(r);
		});
}

function deleteWorkspace(c, cb) {
	var r = new po.Result();
	c.destroy().then(
		function (s) {
			log = new po.SysLog('admin', 'success', 'Deleted Workspace :: ' + c.name);
			updateSysLog(log);

			r.code = 200;
			r.message = 'Delete Workspace From Database';
			r.data = s;
			cb(r);
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Delete Workspace :: ' + c.name);
			updateSysLog(log);

			r.code = 500;
			r.message = 'Failed To Delete Workspace';
			r.data = err;
			cb(r);
		});
}

function findWorkspace(ws, cb) {
	db.Workspace
		.find({where: {uuid: ws.uuid}})
		.then(
		function (c) {
			if (c) cb(null, c);
			else cb(null, null);
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Locate Workspace :: ' + ws.uuid);
			updateSysLog(log);

			cb(err, null);
		});
}

function buildWorkspace(req) {
	return db.Workspace.build({
		uuid:        req.body.uuid,
		name:        req.body.name,
		type:        req.body.type,
		description: req.body.description,
		reservable:  req.body.reservable,
		reserveId:   req.body.reserveId,
		allowLocal:  req.body.allowLocal,
		floorId:     req.body.floorId,
		locationId:  req.body.locationId
	});
}

function processReq(req, cmd, cb) {
	var r = new po.Result();
	var ws = {};

	if (cmd > collect) {
		ws = buildWorkspace(req);
		findWorkspace(ws, function (err, c) {
			if (err) {
				r.code = 500;
				r.message = 'Error Occurred While Trying To Locate Workspace';
				cb(r);
			} else {
				switch (cmd) {
					case create:
					{
						if (c === null) {
							saveWorkspace(ws, function (m) {
								r = m;
								cb(r);
							});
						} else {
							r.code = 409;
							r.message = 'Workspace Already Exists';
							r.data = c;
							cb(r);
						}
						break;
					}
					case update:
					{
						if (c !== null) {
							updateWorkspace(ws, c, function (m) {
								r = m;
								cb(r);
							});
						} else {
							r.code = 404;
							r.message = 'Was Not Able To Locate Workspace';
							cb(r);
						}
						break;
					}
					case destroy:
					{
						if (c !== null) {
							deleteWorkspace(c, function (m) {
								r = m;
								cb(r);
							});
						} else {
							r.code = 409;
							r.message = 'Was Not Able To Locate Workspace';
							cb(r);
						}
						break;
					}
					default:
					{
						break;
					}
				}
			}
		});
	} else {
		cb(null);
	}
}

////////////////////////////////////////////////////////
// HTTP Functions

exports.get = function (req, res) {
	db.Workspace.findAll().then(
		function (c) {
			if (c) res.status(200).json(c);
			else   res.status(404).json(null);
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Collect All Workspaces');
			updateSysLog(log);

			res.status(500).json(err);
		});
};

exports.fetch = function (req, res) {
	var ws = db.Workspace.build({});
	res.status(200).json(ws);
};

exports.types = function (req, res) {
	db.WorkspaceType.findAll().then(
		function (t) {
			if (t) {
				res.statusCode = 200;
				res.json(t);
			} else {
				res.statusCode = 404;
				res.json({message: 'Unable To Locate List'});
			}
		},
		function (err) {
			res.statusCode = 500;
			res.json({message: e});
		});
};

exports.create = function (req, res) {
	processReq(req, create, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};

exports.update = function (req, res) {
	processReq(req, update, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};

exports.remove = function (req, res) {
	processReq(req, destroy, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};