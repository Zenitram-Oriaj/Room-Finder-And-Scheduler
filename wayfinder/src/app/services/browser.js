/**=========================================================
 * Module: browser.js
 * Browser detection
 * User-agent header sent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0
 =========================================================*/

app.service('browser', function () {
	"use strict";
	this.status = function () {
		return window.navigator.onLine;
	};

	this.myIP = function(){
		return $http.get('./myIP');
	};

	this.params = function (url) {
		var str = url || window.location.search;
		var query = str.substring(str.indexOf('?') + 1).split('&');
		var params = {};
		var pair = [];
		var d = decodeURIComponent;

		for (var i = query.length - 1; i >= 0; i--) {
			pair = query[i].split('=');
			params[d(pair[0])] = d(pair[1]);
		}
		return params;
	};

	this.screen = function () {
		return {
			width:      window.screen.width,
			height:     window.screen.height,
			colorDepth: window.screen.colorDepth
		};
	};

	this.os = function () {
		var osInfo = function (ua) {
			var a = ua.indexOf('(');
			var b = ua.indexOf(')');
			a += 1;

			var tmp = ua.substring(a, b);
			var dat = tmp.split(';');
			for (var i in dat) {
				dat[i].trim();
			}
			return dat;
		};

		return {
			arch: window.navigator.platform,
			info: osInfo(window.navigator.userAgent)
		};
	};

	this.detect = function () {
		var matched;
		var browser = {};

		var uaMatch = function (ua) {
			ua = ua.toLowerCase();

			var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
				/(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
				[];

			var platform_match = /(ipad)/.exec(ua) ||
				/(iphone)/.exec(ua) ||
				/(android)/.exec(ua) ||
				/(windows phone)/.exec(ua) ||
				/(win)/.exec(ua) ||
				/(mac)/.exec(ua) ||
				/(linux)/.exec(ua) ||
				/(cros)/i.exec(ua) ||
				[];

			return {
				browser:  match[3] || match[1] || "",
				version:  match[2] || "0",
				platform: platform_match[0] || ""
			};
		};

		matched = uaMatch(window.navigator.userAgent);

		if (matched.browser) {
			browser[matched.browser] = true;
			browser.version = matched.version;
			browser.versionNumber = parseInt(matched.version);
		}

		if (matched.platform) {
			browser[matched.platform] = true;
		}

		// These are all considered mobile platforms, meaning they run a mobile browser
		if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
			browser.mobile = true;
		}

		// These are all considered desktop platforms, meaning they run a desktop browser
		if (browser.cros || browser.mac || browser.linux || browser.win) {
			browser.desktop = true;
		}

		// Chrome, Opera 15+ and Safari are webkit based browsers
		if (browser.chrome || browser.opr || browser.safari) {
			browser.webkit = true;
		}

		// IE11 has a new token so we will assign it msie to avoid breaking changes
		if (browser.rv) {
			var ie = "msie";

			matched.browser = ie;
			browser[ie] = true;
		}

		// Opera 15+ are identified as opr
		if (browser.opr) {
			var opera = "opera";

			matched.browser = opera;
			browser[opera] = true;
		}

		// Stock Android browsers are marked as Safari on Android.
		if (browser.safari && browser.android) {
			var android = "android";

			matched.browser = android;
			browser[android] = true;
		}

		// Assign the name and platform variable
		browser.name = matched.browser;
		browser.platform = matched.platform;

		browser.geoLocation = window.navigator.geolocation;

		return browser;
	};
});