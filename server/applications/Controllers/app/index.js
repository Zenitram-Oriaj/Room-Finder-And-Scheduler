/**
 * Created by Jairo Martinez on 9/5/14.
 */
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('../routes');

var app = express();

module.exports = function(cfg){
	if(cfg.ctrl.debug){
		app.use(logger('dev'));
	}
	app.use(bodyParser.urlencoded({'extended':'true'}));
	app.use(bodyParser.json());
	app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

	app.use('/', routes);

	app.set('port', cfg.ctrl.port);

	return app;
};
