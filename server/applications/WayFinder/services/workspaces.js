/**
 * Created by Jairo Martinez on 9/22/14.
 */
var Sequelize = require('sequelize');
var log = {};

module.exports.collect = function (req, res) {
	try {
		var floorId = req.query.floorId;
		var locationId = req.query.locationId;

		db.Workspace.findAll({where: Sequelize.and({floorId: floorId},{locationId: locationId})}).then(
			function (c) {
				if (c) {
					res.status(200).json(c);
				} else {
					res.status(404).json({});
				}
			},
			function (err) {
				log = new po.SysLog('wayfinder', 'error', 'Failed To Collect All Workspaces');
				updateSysLog(log);

				res.status(500).json(err);
			});
	}
	catch(ex){
		res.status(500).json(ex);
	}
};

module.exports.wsInfoByUuid = function (req, res) {
	try {
		var uuid = req.params.uuid;

		db.Workspace.find({where: {uuid: uuid}}).then(
			function (c) {
				if (c) {
					res.status(200).json(c);
				} else {
					res.status(404).json({});
				}
			},
			function (err) {
				log = new po.SysLog('wayfinder', 'error', 'Failed To Get Workspace By UUID :: ' + uuid);
				updateSysLog(log);

				res.statusCode = 500;
				res.json(err);
			});
	}
	catch(ex){
		res.status(500).json(ex);
	}
};

module.exports.wsInfoByResId = function (req, res) {
	try {
		var id = req.params.id;

		db.Workspace.find({where: {reserveId: id}}).then(
			function (c) {
				if (c) {
					res.status(200).json(c);
				} else {
					res.status(404).json({});
				}
			},
			function (err) {
				log = new po.SysLog('wayfinder', 'error', 'Failed To Get Workspace By Reserve ID :: ' + id);
				updateSysLog(log);

				res.status(500).json(err);
			});
	}
	catch(ex){
		res.status(500).json(ex);
	}
};

module.exports.get = function (req, res) {
	try {
		var floorId = req.query.floorId;
		var locationId = req.query.locationId;

		db.Controller.findAll({where: Sequelize.and({floorId: floorId},{locationId: locationId})}).then(
			function (cts) {
				if (cts) {

					var evts = [];
					for (var i in cts) {
						var evt = {
							uuid:    cts[i].workspaceUuid,
							state: cts[i].state
						};
						evts.push(evt);
					}
					res.status(200).json(evts);
				} else {
					res.status(404).json({});
				}
			},
			function (err) {
				log = new po.SysLog('wayfinder', 'error', 'Failed To Collect All Controllers :: ' + err);
				updateSysLog(log);

				res.status(500).json({});
			});
	}
	catch(ex){
		res.status(500).json(ex);
	}
};