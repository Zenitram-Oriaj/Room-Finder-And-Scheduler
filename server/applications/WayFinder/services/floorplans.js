/**
 * Created by Jairo Martinez on 12/8/14.
 */

var fs = require('fs');
var path = require('path');
var rootDir = path.resolve(__dirname, '..');

function LocationList(cb) {
	db.Location
		.findAll()
		.then(
		function (res) {
			if (res) {
				cb(null, res);
			} else {
				cb(null, null);
			}
		},
		function (err) {
			r.code = 500;
			r.message = "Error Get Schedule Data";
			r.error = err;
			cb(err, r);
		});
}

function FloorList(id, cb) {
	fs.readFile(rootDir + "/floorplans/" + id + "/location.json", function (err, res) {
		if (err) {
			cb(err, null);
		} else {
			var inf = JSON.parse(res);
			cb(null, inf);
		}
	});
}

module.exports.get = function (req, res) {
	try {
		var loc = req.query.locationId;
		var flr = req.query.floorId;
		var file = req.params.file;

		var filePath = rootDir + '/floorplans/' + loc + '/' + flr + '/' + file;
		res.statusCode = 200;
		res.type('image/svg+xml');
		res.sendfile(filePath, function(err,rsl){
			if(err){

			} else {

			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.floorList = function (req, res) {
	try {
		var loc = req.query.locationId;

		if (loc === undefined) {
			res.status(404).json({});
		} else {
			FloorList(loc, function (err, dat) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(200).json(dat);
				}
			});
		}
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.locationList = function (req, res) {
	try {
		LocationList(function (err, dat) {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(dat);
			}
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};