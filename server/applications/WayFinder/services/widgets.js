/**
 * Created by Jairo Martinez on 7/21/15.
 */

function sendReq(url, cb) {
	var req = require('request');
	req(url, function (err, res, body) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, body);
		}
	});
}

////////////////////////////////////////////////////////////////////

module.exports.weather = function (req, res) {
	try {

	}
	catch(ex) {
		res.status(500).json(ex);
	}

	var obj = req.body;

	var url = 'http://query.yahooapis.com/v1/public/yql?';
	var u = obj.units;
	var a = obj.id.indexOf(',');
	if (a > -1) url += 'q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + obj.id + '%22)%20and%20u%3D%22' + u + '%22&format=json';
	else url += 'q=select%20item%20from%20weather.forecast%20where%20location%3D%22' + obj.id + '%22%20and%20u%3D%22' + u + '%22&format=json';

	sendReq(url, function (err, dat) {
		if (err) {
			res.status(err.code).json(err);
		} else {
			var j = JSON.parse(dat);
			res.status(200).json(j);
		}
	});
};

module.exports.stock = function (req, res) {
	try {

	}
	catch(ex) {
		res.status(500).json(ex);
	}
	var obj = req.body;

	var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%28%22' + obj.id +
		'%22%29%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

	sendReq(url, function (err, dat) {
		if (err) {
			res.status(err.code).json(err);
		} else {
			try {
				var j = JSON.parse(dat);
				res.status(200).json(j);
			}
			catch(ex) {
				res.status(404).json({});
			}
		}
	});
};

module.exports.url = function (req, res) {
	try {

	}
	catch(ex) {
		res.status(500).json(ex);
	}
	var obj = req.body;

	if (obj.url) {
		sendReq(obj.url, function (err, dat) {
			if (err) {
				res.status(err.code).json(err);
			} else {
				var j = JSON.parse(dat);
				res.status(200).json(j);
			}
		});
	}
};