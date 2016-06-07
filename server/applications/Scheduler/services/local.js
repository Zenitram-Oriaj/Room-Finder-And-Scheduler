/**
 * Created by Jairo Martinez on 6/12/15.
 */

var config = {};

function init(cfg, cb) {
	config = cfg;
	cb('Nothing Define For Local Scheduling Support',null);
}

module.exports.init = init;

module.exports.collect = function(cb){
	cb('Nothing Define For Local Scheduling Support',null);
};

module.exports.cancel = function(cb){
	cb('Nothing Define For Local Scheduling Support',null);
};