/**
 * Created by Jairo Martinez on 8/25/14.
 */
var express = require('express');
var fs = require('fs');
var router = express.Router();
var workspaces = require('../services/workspaces');
var schedule = require('../services/schedule');
var floorplans = require('../services/floorplans');
var registration = require('../services/registration');
var security = require('../services/security');
var widgets = require('../services/widgets');

router.use(function (req, res, next) {
	var responseSettings = {
		"AccessControlAllowOrigin":      req.headers.origin,
		"AccessControlAllowHeaders":     "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
		"AccessControlAllowMethods":     "POST, GET, PUT, DELETE, OPTIONS",
		"AccessControlAllowCredentials": true
	};

	res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
	res.header("Access-Control-Allow-Origin", responseSettings.AccessControlAllowOrigin);
	res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
	res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

	next();
});

router.options(/\.*/, function (req, res) {
	res.send(200);
});

router.get('/*', function (req, res, next) {
	if (req.path.indexOf('/img/wt/') > -1) {
		res.statusCode = 200;
		res.end();
	} else {
		next();
	}
});

//
//////////////////////////////////////////////////////////////////////

router.post('/login', security.login);
router.post('/challenge', security.challenge);

//
//////////////////////////////////////////////////////////////////////

router.get('/floorplan/:file', floorplans.get);
router.get('/floorlist', floorplans.floorList);
router.get('/locationlist', floorplans.locationList);

//
//////////////////////////////////////////////////////////////////////

router.get('/json/workspaces', workspaces.collect);
router.get('/json/workspace/:id', workspaces.wsInfoByUuid);
router.get('/json/workspaceByResId/:id', workspaces.wsInfoByResId);
router.get('/api/getWsStatus', workspaces.get);

//
//////////////////////////////////////////////////////////////////////

router.get('/json/getSchedule/:resId', schedule.get);
router.get('/json/getLocalSchedule/:resId', schedule.getLocal);
router.get('/json/resource/:resId', schedule.resource);
router.post('/json/schedule/create', schedule.create);
router.post('/json/schedule/update', schedule.update);
router.post('/json/schedule/remove', schedule.remove);

//
//////////////////////////////////////////////////////////////////////

router.post('/api/widgets/weather', widgets.weather);
router.post('/api/widgets/stock', widgets.stock);
router.post('/api/widgets/url', widgets.url);


// TEMP ROUTES FOR TESTING
//////////////////////////////////////////////////////////////////////

router.get('/json/group/:grpId', schedule.group);
router.get('/json/location/:locId', schedule.location);
router.get('/json/resourceSetups', schedule.setups);
router.get('/json/searchableUDF', schedule.searchableUDF);
router.get('/json/typeSummaries', schedule.typeSummaries);

//
//////////////////////////////////////////////////////////////////////

router.get('/myIP', registration.myIP);
router.post('/api/register', registration.register);
router.post('/api/tpUpdate', registration.update);
router.post('/api/heartbeat', registration.heartbeat);
router.post('/api/uuid', registration.getUuidByIp);
router.post('/api/config', registration.config);

//
//////////////////////////////////////////////////////////////////////

router.get('/json/schedule/fetch', function (req, res) {
	var obj = db.Reservation.build({
		description: 'Local Reservation'
	});

	res.status(200).json(obj);
});

//
//////////////////////////////////////////////////////////////////////

router.get('/reset', function (req, res) {
	res.render('reset');
});

router.get('/', function (req, res) {
	res.render('index');
});

module.exports = router;
