/**
 * Created by Jairo Martinez on 9/5/14.

 GET /settings_m2m?
 &sip_descr=Room303
 &dev_pswd=mypassword
 &serv1url=http%3A%2F%2F10.10.3.5%2Fregistration
 &serv1type=boi
 &reg_iv=300
 &reg_srvrbopt=never
 &gpio_callback=http%3A%2F%2F10.10.3.5%2Fstatus
 &gpix_rtms=30000
 &unif=ips21_1_4_0005.bin
 &floc=http%3A%2F%2F10.10.7.69%3A:8089%2F
 &usestatic=static+IP
 &ip=10.10.3.4
 &netmask=255.255.255.0
 &gateway=10.10.4.250
 &dns_server=10.10.6.7

 /settings_m2m?dev_pswd=boi123&serv1url=http%3A%2F%2F155.118.39.238:3001%2Fregistration&gpio_callback=http%3A%2F%2F155.118.39.238:3001%2Fstatus
 /settings_m2m?&gpix_rtms=30000
 /settings_m2m?unif=ips21_1_4_0005.bin&floc=http%3A%2F%2F155.118.39.238%2Ffiles


 /settings_m2m?unif=ips21_1_4_0005.bin&floc=http%3A%2F%2F172.16.76.4%3A3000%2Ffiles

 /settings_m2m?dev_pswd=boi123&serv1url=http%3A%2F%2F172.16.76.4:3001%2Fregistration&gpio_callback=http%3A%2F%2F172.16.76.4:3001%2Fstatus&gpix_rtms=30000

 settings_m2m?dev_pswd=boi123&serv1url=http%3A%2F%2F192.168.1.134:3001%2Fregistration&gpio_callback=http%3A%2F%2F192.168.1.134:3001%2Fstatus&gpix_rtms=0

 /settings_m2m?device_defaults

 */

var xml2js = require('xml2js');

function XmlToJson(xml, cb) {
	var parser = new xml2js.Parser({
		mergeAttrs: true
	});

	parser.parseString(xml, function (err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, result);
		}
	});
}

function SendReq(url, cb){
	var req = require('request');
	var e = {
		code: 0,
		message:'',
		xml: '',
		err: {}
	};

	req(url, function (err, res, body) {
		if (err) {
			if (err.code == 'EHOSTUNREACH') {
				e.code = err.code;
				e.xml =  '<IPSensor><Failed reason="UNREACHABLE" /></IPSensor>';
				e.err = err;
				cb(e, null);
			}
			else if (err.code == 'ETIMEDOUT') {
				e.code = err.code;
				e.xml = '<IPSensor><Failed reason="TIMEDOUT" /></IPSensor>';
				e.err = err;
				cb(e, null);
			}
			else if (err.code == 'ECONNRESET') {
				e.code = err.code;
				e.xml = '<IPSensor><Failed reason="CONNRESET" /></IPSensor>';
				e.err = err;
				cb(e, null);
			} else {
				e.code = err.code;
				e.err = err;
				e.message = 'Failed';
				cb(err, null);
			}
		} else {
			var str = body.replace(/(\r\n|\n|\r)/gm, "");
			str = str.replace(/\s+/gm, " ");
			cb(null, str);
		}
	});
}

function UpdateCtrl(ct, cb) {
	var dscr = '';
	var url = 'http://' + ct.ip + '/settings_m2m?' + 'gpix_rtms=' + (ct.timeout * 1000);

	if(ct.description){
		dscr = ct.description.replace(/\s/gm, "%20");
		url += '&sip_descr=' + dscr;
	}

	url += '&reg_iv=' + ct.heartbeat;
	
	if (ct.mode == 'M') {
		url += '&usestatic=static+IP';
		url += '&ip=' + ct.ip;
		url += '&netmask=' + ct.netmask;
		url += '&gateway=' + ct.gw;
		url += '&dns_server=' + ct.dns;
	}

	SendReq(url,function(err,res){
		cb(err,res);
	});
}

function RebootCtrl(ct, cb) {
	var url = 'http://' + ct.ip + '/reboot?password=' + ct.password;
	SendReq(url,function(err,res){
		if(err){
			var log = new po.SysLog('controller', 'error', 'Failed To Reboot Controller :: ' + ct.uuid);
			updateSysLog(log);
		}
		cb(err,res);
	});
}

function ResetCtrl(ct, cb){
	var url = 'http://' + ct.ip + '/settings_m2m?device_defaults';
	SendReq(url,function(err,res){
		cb(err,res);
	});
}

//
////////////////////////////////////////////////////////////////////////////////////

module.exports.update = function (ct, cb) {
	try {
		UpdateCtrl(ct, function (err, res) {
			if (err) {
				cb(err, null);
			} else {
				XmlToJson(res, function (err, jsn) {
					if (err) {
						cb(err, null);
					} else {
						RebootCtrl(ct, function (err, res) {});
						cb(null, jsn);
					}
				})
			}
		})
	}
	catch(ex) {
		cb(ex,null);
	}
};

module.exports.reset = function (ct, cb) {
	try {
		ResetCtrl(ct, function(err,res){
			if(err){
			} else {
				RebootCtrl(ct,function(err,res){
					cb(err,res);
				});
			}
		})
	}
	catch(ex) {
		cb(ex,null);
	}
};

module.exports.reboot = function (ct, cb) {
	try {
		RebootCtrl(ct, function(err,res){
			cb(err,res);
		})
	}
	catch(ex) {
		cb(ex,null);
	}
};