/**
 * Created by Jairo Martinez on 12/26/14.
 */
var fs = require('fs');
var tzs = JSON.parse(fs.readFileSync(__dirname + "/../../configs/timezones.json"));

module.exports.tzs = tzs;