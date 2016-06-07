/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('timeDate', function () {

	this.getDuration = function (milli) {
		var minutes = Math.floor((milli / (60 * 1000)) % 60);
		var hours = Math.floor((milli / (60 * 60 * 1000)) % 60);
		if (minutes < 10) minutes = '0' + minutes.toString();
		return hours + ":" + minutes;
	};

	this.parseHourMinutes = function (val) {
		var hours = 0;
		var minutes = 0;
		var str = '';

		var x = (val / 60 ) / 10000;

		if (x >= 60) {
			hours = Math.floor(x / 60);
			minutes = Math.ceil(x % 60);

			str += hours + " Hour";
			if (hours > 1) str += "s";
			if (minutes > 0) str += " " + minutes + " Mins";

			return str;
		} else {
			return Math.ceil(x) + " Mins";
		}
	};

	this.formatTimeString = function (str) {
		var dt = new Date(Date.parse(str));
		var hh = dt.getHours();
		var mm = dt.getMinutes();
		var td = 'am';

		if (hh >= 12) td = 'pm';
		if (hh > 12) hh = hh - 12;
		if (mm < 10) mm = '0' + mm;

		return hh + ':' + mm + ' ' + td;
	};

	this.checkTime = function (start, stop) {
		var dt = new Date();
		var pre = Date.parse(start);
		var pst = Date.parse(stop);

		return (dt >= pre && dt <= pst);
	};

	this.GetDateTimeStr = function (dt) {

		var yy = dt.getFullYear();
		var mm = dt.getMonth() + 1;
		var dd = dt.getDate();

		var hh = dt.getHours();
		var nn = dt.getMinutes();

		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		if (hh < 10) hh = '0' + hh;
		if (nn < 10) nn = '0' + nn;

		return yy + '-' + mm + '-' + dd + 'T' + hh + ':' + nn + ':00.000';
	};
});
