/**
 * Created by Jairo Martinez on 8/25/14.
 */
var path = require('path');
var fs = require('fs');
var srvrDir = path.resolve(__dirname, '../../../');
var dbCfg = {};
var Sequelize = require('sequelize');
var lodash = require('lodash');

try {
	fs.openSync(srvrDir + "/configs/gateway.json", 'r');
	dbCfg = JSON.parse(fs.readFileSync(srvrDir + "/configs/gateway.json"));
}
catch (err) {
	dbCfg = JSON.parse(fs.readFileSync(srvrDir + "/configs/default.json"));
}

var dbg = false;
if(dbCfg.db.debug) {
	dbg = console.log;
}

function GetTimeZoneOffset(){
	var dts = new Date();
	var tzo = (dts.getTimezoneOffset() / 60);
	var str = '00:00';
	if(tzo <= 0){
		tzo = Math.abs(tzo);
	} else {
		tzo = Math.abs(tzo) * -1;
	}

	if(tzo > -10 && tzo < 10) {
		if(tzo < 0){
			str = '-0' + Math.abs(tzo).toString() + ':00';
		} else {
			str = '+0' + tzo.toString() + ':00';
		}
	} else {
		str = tzo.toString + ':00';
	}
	return str;
}

var sequelize = new Sequelize(dbCfg.db.schema, dbCfg.db.user, dbCfg.db.pass, {
	host:     dbCfg.db.ip,
	dialect:  dbCfg.db.dialect,
	port:     dbCfg.db.port,
	logging:  dbg,
	timezone: GetTimeZoneOffset()
});

var rootDir = __dirname + '/models';

var db = {};

sequelize.authenticate().then(
	function(res){

	},
	function(err){
		var log = new po.SysLog('admin', 'error', 'Unable To Connect To The DB :: ' + err);
		updateSysLog(log);
	});


fs.readdirSync(rootDir)
	.filter(function (file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js')
	})
	.forEach(function (file) {
		var model = sequelize.import(path.join(rootDir, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db)
	}
});

module.exports = lodash.extend({
	sequelize: sequelize,
	Sequelize: Sequelize
}, db);
