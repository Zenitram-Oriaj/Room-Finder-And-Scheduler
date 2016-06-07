/**
 * Created by Jairo Martinez on 6/1/15.
 */

app.service('analytics', function (dateTime) {
	var self = this;

	this.online = function (obj) {
		var total = 0;
		var ok = 0;

		for (var i in obj) {
			total += 1;
			if (obj[i].status === 'ONLINE') ok += 1;
		}

		return ok.toString() + '/' + total.toString();
	};

	this.occupied = function (ws) {
		var total = 0;
		var occ = 0;

		for (var i in ws) {
			total += 1;
			if (ws[i].status == 1) occ += 1;
		}

		return occ.toString() + '/' + total.toString();
	};

	this.scheduled = function (ws) {
		var total = 0;
		var sch = 0;

		for (var i in ws) {
			if (ws[i].reservable == 1) total += 1;
			if (ws[i].scheduled == 1) sch += 1;
		}

		return sch.toString() + '/' + total.toString();
	};

	this.duration = function (evts) {
		var cnt = 0;
		var ttl = 0;
		console.log(evts);
		for (var i in evts) {
			if (evts[i].state == 'occupied' && evts[i].millis > 0) {
				cnt += 1;
				ttl += evts[i].millis;
			}
		}

		if (ttl > 0) return dateTime.msToTime(ttl / cnt);
		else return '00:00:00';
	};

	this.fromToday = function (cts, evts, cb) {
		var todayEvts = [];
		var tmp = [];
		var ctrls = [];
		var dt = new Date();
		dt.setHours(0, 0, 0, 0);

		for (var i = 0; i < evts.length; i++) {
			todayEvts.push(evts[i]);
		}

		console.info(todayEvts);

		if (todayEvts && todayEvts.length > 0) {

			for (var a = 0; a < cts.length; a++) {
				var total = 0;
				var uuid = cts[a].uuid;

				for (var b = 0; b < todayEvts.length; b++) {
					if (todayEvts[b].uuid == uuid) {
						total += Math.floor((todayEvts[b].millis / 1000) / 60);
					}
				}
				if (total > 0) {
					var c = {
						uuid:  cts[a].uuid,
						name:  cts[a].workspaceName,
						total: total
					};

					tmp.push(c);
				}
			}

			console.info(tmp);

			if (tmp.length > 0) {
				tmp.sort(function(a, b){ return b.total - a.total });
				var ref = (tmp.length < 5) ? tmp.length : 5;
				for (var i = 0; i < ref; i++) {
					ctrls.push(tmp[i]);
				}
			} else {
				ctrls = tmp;
			}
		}
		console.info(ctrls);

		cb(ctrls);
	}
});