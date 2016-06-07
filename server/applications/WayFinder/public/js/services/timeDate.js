/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('timeSvc', function () {

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

	this.msToTime = function (milli) {
		var seconds = Math.floor((milli / 1000) % 60);
		var minutes = Math.floor((milli / (60 * 1000)) % 60);
		var hours = Math.floor((milli / (60 * 60 * 1000)) % 60);

		if (hours < 10) hours = '0' + hours.toString();
		if (minutes < 10) minutes = '0' + minutes.toString();
		if (seconds < 10) seconds = '0' + seconds.toString();

		return hours + ":" + minutes + ":" + seconds;
	};

	this.duration = function (milli) {
		var minutes = Math.floor((milli / (60 * 1000)) % 60);
		var hours = Math.floor((milli / (60 * 60 * 1000)) % 60);
		if (minutes < 10) minutes = '0' + minutes.toString();
		return hours + ":" + minutes;
	};

	this.getTzOffset = function (val) {
		if (val <= 0) {
			return Math.abs(val);
		} else {
			return Math.abs(val) * -1;
		}
	};

	this.getLcOffset = function () {
		var dts = new Date();
		var tzo = (dts.getTimezoneOffset() / 60);
		if (tzo <= 0) {
			return Math.abs(tzo);
		} else {
			return Math.abs(tzo) * -1;
		}
	};

	this.getTzHours = function () {
		var dts = new Date();
		var tzo = (dts.getTimezoneOffset() / 60);
		return tzo;
	};

});