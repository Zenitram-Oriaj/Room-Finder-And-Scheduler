/**
 * Created by Jairo Martinez on 8/25/14.
 */
var express = require('express');
var router = express.Router();

var security = require('../services/security');
var controllers = require('../services/controllers');
var ctrlEvents = require('../services/ctrlEvents');
var workspaces = require('../services/workspaces');
var wayfinders = require('../services/wayfinders');
var touchpanels = require('../services/touchpanels');
var discovers = require('../services/discovers');
var gateway = require('../services/gateway');
var server = require('../services/server');
var schedule = require('../services/schedule');
var dashboard = require('../services/dashboard');

// Security Services
////////////////////////////////////////////////////

router.get('/collectUsers', security.collect);
router.post('/getUser', security.findUser);
router.post('/challenge', security.challenge);
router.post('/register', security.register);
router.post('/login', security.login);
router.post('/logout', security.logout);
router.post('/updateUser', security.updateUser);
router.post('/updatePass', security.updatePass);
router.post('/deleteUser', security.deleteUser);

// Data Services
////////////////////////////////////////////////////

router.get('/api/timezones', gateway.timezones);
router.get('/api/gateway', gateway.get);
router.post('/api/gateway/update', gateway.post);

router.get('/api/controllers', controllers.get);
router.get('/api/controllers/fetch', controllers.fetch);
router.post('/api/controllers/create', controllers.create);
router.post('/api/controllers/update', controllers.update);
router.post('/api/controllers/delete', controllers.remove);

router.get('/api/workspaces', workspaces.get);
router.get('/api/workspaces/fetch', workspaces.fetch);
router.get('/api/workspaces/types', workspaces.types);
router.post('/api/workspaces/create', workspaces.create);
router.post('/api/workspaces/update', workspaces.update);
router.post('/api/workspaces/delete', workspaces.remove);

router.get('/api/wayfinders', wayfinders.get);
router.get('/api/wayfinders/fetch', wayfinders.fetch);
router.post('/api/wayfinders/create', wayfinders.create);
router.post('/api/wayfinders/update', wayfinders.update);
router.post('/api/wayfinders/delete', wayfinders.remove);

router.get('/api/touchpanels', touchpanels.get);
router.get('/api/touchpanels/fetch', touchpanels.fetch);
router.post('/api/touchpanels/create', touchpanels.create);
router.post('/api/touchpanels/update', touchpanels.update);
router.post('/api/touchpanels/delete', touchpanels.remove);

router.get('/api/discovers', discovers.get);
router.post('/api/discovers', discovers.post);
router.post('/api/discovers', discovers.put);

router.get('/api/server/logs', server.logs);
router.get('/api/dashboard/info', dashboard.info);
router.get('/api/dashboard/history', dashboard.history);
router.get('/api/dashboard/events', dashboard.events);

router.get('/api/ctrlEvents', ctrlEvents.get);
router.get('/api/schedule/:resId', schedule.get);

// Default Route
////////////////////////////////////////////////////

router.get('/', function (req, res) {
	res.render('index');
});

router.post('/api/uploads', function (req, res) {
	res.status(200).json({result: 'ok'});
});

module.exports = router;
