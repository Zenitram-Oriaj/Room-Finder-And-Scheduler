/**
 * Created by Jairo Martinez on 10/13/14.
 */

module.exports.Package = function (src, dst, lvl, obj) {
	this.source = src;
	this.destination = dst;
	this.level = lvl;
	this.contents = obj;
};

module.exports.Message = function (typ, msg, obj) {
	this.type = typ;
	this.message = msg;
	this.data = obj;
};

module.exports.SysLog = function (evt, lvl, msg) {
	this.evt = evt;
	this.msg = msg;
	this.lvl = lvl;
};

module.exports.Result = function () {
	this.code = 0;
	this.message = '';
	this.error = {};
	this.data = {};
};