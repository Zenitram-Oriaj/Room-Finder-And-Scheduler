/**
 * Created by Jairo Martinez on 5/18/15.
 */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var multer = require('multer');

var routes = require('../routes');
var rootDir = path.resolve(__dirname, '..');
// var coreDir = path.resolve(__dirname, '../../..');

var app = express();
var config = {};

module.exports = function (cfg) {
	app.set('views', path.join(rootDir, 'views'));
	app.set('view engine', 'ejs');
	app.set('jwtTokenSecret', 'A34B22D4F3E23');

	if (cfg.http.debug) {
		app.use(logger('dev'));
	}

	app.use(bodyParser.json());
	app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
	app.use(bodyParser.urlencoded({'extended': 'true'}));
	app.use(methodOverride());
	app.use(cookieParser());

	app.use(express.static(path.join(rootDir, 'public')));

	app.use(multer({
		dest:                 rootDir + '/files/img/',
		includeEmptyFields:   true,
		rename:               function (fieldname, filename) {
			return filename + '_' + Date.now();
		},
		onFileUploadStart:    function (file, req, res) {
			console.log(file.originalname + ' is starting ...');
		},
		onFileUploadComplete: function (file, req, res) {
			console.log(req.body);
			console.log(file.fieldname + ' uploaded to  ' + file.path);
			done = true;
		}
	}));

	app.use('/', routes);

/// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	if (app.get('env') === 'development') {
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error:   err
			});
		});
	}

	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error:   {}
		});
	});

	app.set('port', cfg.http.port);

	return app;
};