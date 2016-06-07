/**
 * Created by Jairo Martinez on 9/5/14.
 */

var express = require('express');
var router = express.Router();

var events = require('../services/events');

router.get('/', events.get);
router.get('/registration', events.registration);
router.get('/status', events.status);

module.exports = router;