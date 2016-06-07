/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('reservation', function (data, modal, timeDate) {
	var result = {
		pass: false,
		type: '',
		msg:  ''
	};

	this.build = function (scp) {
		data.fetch(scp.ao.url).then(
			function (res) {
				scp.res = res.data;
				scp.res.create = true;
				scp.res.duration = 0;
				scp.minutes = 15;
				scp.res.startTime = new Date();
				scp.res.stopTime = new Date();

				scp.res.startTime.setSeconds(0);
				scp.res.stopTime.setMinutes(scp.res.startTime.getMinutes() + scp.minutes);
				scp.res.stopTime.setSeconds(0);

				modal.show(2, scp);
			},
			function (err) {
					console.error(err);
			});
	};

	this.extend = function (scp) {
		scp.obj = result;

		var ds = new Date(scp.res.startTime);
		var dn = new Date(scp.res.stopTime);

		scp.res.duration = (dn - ds);
		scp.res.duration = scp.res.duration + (15 * 60 * 1000);

		scp.hideModal(scp.modalId, scp);

		data.update(scp.res, scp.ao.url).then(
			function (res) {
				var rd = res.data.SubmitReservationResult;

				if (rd.IsValid == 'true' || rd.IsValid == true) {
					scp.obj.pass = true;
					scp.obj.type = 'Updated';
				} else {
					scp.obj.pass = false;

					if (rd.AllChildBrokenBusinessRules.BrokenRuleData.Description) {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;

					} else {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData[0].Description;
					}
				}

				modal.show(7, scp);
			},
			function (err) {
				console.log(err);
			});
	};

	this.end = function (scp) {
		scp.obj = result;

		var dt = new Date();
		var ds = new Date(scp.res.startTime);

		scp.res.duration = (dt - ds);

		scp.hideModal(scp.modalId, scp);

		data.update(scp.res, scp.ao.url).then(
			function (res) {
				var rd = res.data.SubmitReservationResult;

				if (rd.IsValid == 'true' || rd.IsValid == true) {
					scp.obj.pass = true;
					scp.obj.type = 'Updated';
				} else {
					scp.obj.pass = false;

					if (rd.AllChildBrokenBusinessRules.BrokenRuleData.Description) {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;

					} else {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData[0].Description;
					}
				}

				modal.show(7, scp);
			},
			function (err) {
				console.log(err);
			});
	};

	this.edit = function (scp) {
		scp.hideModal(scp.modalId);
		scp.res = $.extend({}, scp.refMeeting);

		scp.res.startTime = new Date(scp.res.startTime);
		scp.res.stopTime = new Date(scp.res.stopTime);

		scp.minutes = (scp.res.duration / 10000) / 60;
		scp.showModal(8);
	};

	this.create = function (scp) {
		scp.obj = result;

		var ds = new Date(scp.res.startTime);
		var dn = new Date(scp.res.stopTime);

		scp.res.duration = (scp.minutes * 60 * 1000);
		scp.res.description = 'Local Reservation';
		scp.res.notes = 'A local reservation made from touch panel';
		scp.res.numOfAttendees = 1;
		scp.res.resourceId = scp.ao.reserveId;

		scp.res.startTime = timeDate.GetDateTimeStr(ds);
		scp.res.stopTime = timeDate.GetDateTimeStr(dn);

		scp.hideModal(scp.modalId, scp);

		data.create(scp.res, scp.ao.url).then(
			function (res) {
				var rd = res.data.SubmitReservationResult;

				if (rd.IsValid == 'true' || rd.IsValid == true) {
					scp.obj.pass = true;
					scp.obj.type = 'Created';
				} else {
					scp.obj.pass = false;
					if (rd.AllChildBrokenBusinessRules.BrokenRuleData instanceof Array) {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData[0].Description;
					} else {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;
					}
				}

				modal.show(7, scp);
			},
			function (err) {
				console.error(err);
			});
	};

	this.update = function (scp) {
		scp.obj = result;
		scp.res.duration = (scp.minutes * 60 * 1000);
		scp.hideModal(scp.modalId, scp);

		data.update(scp.res, scp.ao.url).then(
			function (res) {
				var rd = res.data.SubmitReservationResult;

				if (rd.IsValid == 'true' || rd.IsValid == true) {
					scp.obj.pass = true;
					scp.obj.type = 'Updated';
				} else {
					scp.obj.pass = false;
					if (rd.AllChildBrokenBusinessRules.BrokenRuleData instanceof Array) {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData[0].Description;
					} else {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;
					}
				}
				modal.show(7, scp);
			},
			function (err) {
				console.error(err);
			});
	};

	this.remove = function (scp) {
		scp.obj = result;

		scp.hideModal(scp.modalId, scp);

		data.remove(scp.res, scp.ao.url).then(
			function (res) {
				var rd = res.data.DeleteReservationResult;

				if (rd.IsValid == 'true' || rd.IsValid == true) {
					scp.obj.pass = true;
					scp.obj.type = 'Removed';
				} else {
					scp.obj.pass = false;
					if (rd.AllChildBrokenBusinessRules.BrokenRuleData.Description) {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData.Description;

					} else {
						scp.obj.msg = rd.AllChildBrokenBusinessRules.BrokenRuleData[0].Description;
					}
				}

				modal.show(7, scp);
			},
			function (err) {
				console.error(err);
			});
	};
});