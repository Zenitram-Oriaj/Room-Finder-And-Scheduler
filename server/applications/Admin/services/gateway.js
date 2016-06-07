/**
 * Created by Jairo Martinez on 8/25/14.
 */
var fs = require('fs');
var gw = {};

exports.timezones = function (req, res) {
	var tz = JSON.parse(fs.readFileSync(__dirname + "/files/timezones.json"));
	if (tz === null) {
		res.statusCode = 404;
		res.json(null);
	} else {
		res.statusCode = 200;
		res.json(tz);
	}
};

exports.get = function (req, res) {
	global.config.referenceAt = new Date();
	gw = global.config;
	if (gw === null) {
		res.statusCode = 404;
		res.json(null);
	} else {
		res.statusCode = 200;
		res.json(gw);
	}
};

exports.post = function (req, res) {
	gw = req.body;
	gw.updatedAt = new Date();

	global.config = gw;

	var env = new po.Package('HTTP', 'SRVR', 0, {});
	env.contents = new po.Message('configs','/configs/gateway.json', gw);
	process.send(env);

	res.status(200).json({
		code:    200,
		message: 'Gateway Configuration Saved',
		data:    gw
	});
};

