/**
 * Created by Jairo Martinez on 7/18/15.
 */
var os = require('os');

module.exports.init = function(){
	var netif = os.networkInterfaces();
	var network = {};
	
	if (netif.eth0) {
		netif.eth0.forEach(function (i) {
			if (i.family == 'IPv4') {
				network.name = 'eth0';
				network.ip = i.address;
				network.sub = i.netmask || '0.0.0.0';
			}
		});
	}

	else if (netif.en0) {
		netif.en0.forEach(function (i) {
			if (i.family == 'IPv4') {
				network.name = 'en0';
				network.ip = i.address;
				network.sub = i.netmask || '0.0.0.0';
			}
		});
	}

	else if (netif.em0) {
		netif.em0.forEach(function (i) {
			if (i.family == 'IPv4') {
				network.name = 'em0';
				network.ip = i.address;
				network.sub = i.netmask || '0.0.0.0';
			}
		});
	}

	else if (netif.em1) {
		netif.em1.forEach(function (i) {
			if (i.family == 'IPv4') {
				network.name = 'em1';
				network.ip = i.address;
				network.sub = i.netmask || '0.0.0.0';
			}
		});
	}

	return network;
};

