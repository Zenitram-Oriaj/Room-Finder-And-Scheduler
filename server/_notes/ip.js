/**
 * Created by Jairo Martinez on 6/16/15.
 */
app.service('ip', function () {
	// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
	var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	var parts = [];
	var addr = '';
	var type = '';
	var hosts = [];

	var addrs = Object.create(null);
	addrs["0.0.0.0"] = false;

	if (RTCPeerConnection) {
		var rtc = new RTCPeerConnection({iceServers: []});

		if (1 || window.mozRTCPeerConnection) {                       // FF [and now Chrome!] needs a channel/stream to proceed
			rtc.createDataChannel('', {reliable: false});
		}

		rtc.onicecandidate = function (evt) {
			if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
		};

		rtc.createOffer(
			function (offerDesc) {
				grepSDP(offerDesc.sdp);
				rtc.setLocalDescription(offerDesc);
			},
			function (e) {
				console.warn("offer failed", e);
			});

		function updateDisplay(newAddr) {
			if (newAddr in addrs) return;
			else addrs[newAddr] = true;
			var displayAddrs = Object.keys(addrs).filter(function (k) {
				return addrs[k];
			});
		}

		function grepSDP(sdp) {
			sdp.split('\r\n').forEach(function (line) {
				if (~line.indexOf("a=candidate")) {
					parts = line.split(' ');
					addr = parts[4];
					type = parts[7];

					if (type === 'host') updateDisplay(addr);
				}
				else if (~line.indexOf("c=")) {
					parts = line.split(' ');
					addr = parts[2];
					updateDisplay(addr);
				}
			});
		}
	}
});