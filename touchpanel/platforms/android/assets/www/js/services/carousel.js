/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('carousel', function ($compile, data, widget, timeDate) {
	var Filler = '<li class = "filler"></li>';

	var ClearUI = function () {
		$('#lblTitle').text('Room Available For Reservation');
		$('#lblRunTime').text('');
	};

	var UpdateUI = function (obj) {
		$('#lblTitle').text(obj.description);
		$('#lblRunTime').text(timeDate.formatTimeString(obj.startTime) + ' - ' + timeDate.formatTimeString(obj.stopTime));
	};

	this.empty = function (scp) {
		var cHtml = '';
		var html = '';

		html = '<ul>';

		html += '<li class = "widget">';
		html += '<div id = "wStrt" class = "widget-stime">';
		html += '<h3><b>All Day</b></h3></div>';
		html += '<div class = "widget-title widget-default">';
		html += '<h2>NO MEETINGS SCHEDULED</h2></div>';
		html += '<div class = "widget-body widget-body-default">';
		html += '<h3> </h3></div>';
		html += '<div class = "widget-footer widget-body-default">';
		html += '<h5>You Can Book Any Time</h5></div>';
		html += '</li>';

		html += '<li class = "filler"></li>';
		html += '<li class = "filler"></li>';

		html += '</ul>';

		cHtml = $compile(html)(scp);
		scp.jcl = $('.jcarousel').jcarousel();
		scp.jcl.html(cHtml);
		scp.jcl.jcarousel({
			wrap:      '',
			animation: 'slow'
		});

		scp.jcl.jcarousel('reload');
		ClearUI();
	};

	this.build = function (scp) {
		this.live = 0;
		var cHtml = '';
		var html = '';

		var cnt = 0;
		html = '<ul>';

		scp.reservations.sort(function (a, b) {
			var dtA = new Date(a.startTime);
			var dtB = new Date(b.startTime);
			return dtA - dtB;
		});

		scp.reservations.forEach(function (r) {
			var dt = new Date();

			cnt += 1;
			r.id = cnt;
			r.startTime = new Date(r.startTime);
			r.stopTime = new Date(r.stopTime);
			r.opts = (r.createdById == 123403);

			if (dt.getDate() == r.startTime.getDate()) {

				if (dt >= r.startTime && dt <= r.stopTime) r.status = 'active';

				// Determine if the reservation has a host
				r.host = (r.createdForName.length > 0 ? r.createdForName : r.createdByName);

				if (r.createdById == 123403) {
					r.opts = true;
					r.host = 'Local';
				}

				if (timeDate.checkTime(r.startTime, r.stopTime)) {
					scp.ActiveMeeting = parseInt(r.id);
					UpdateUI(r);
				}

				if (scp.ActiveMeeting > 0) {
					scp.active();
				} else {
					scp.inactive();
				}

				scp.events.push(r);
				scp.TotalMeetings += 1;
				html += widget.create(r);
			}
		});

		html += '<li class = "filler"></li>';
		html += '<li class = "filler"></li>';

		html += '</ul>';

		cHtml = $compile(html)(scp);

		scp.jcl = $('.jcarousel').jcarousel();
		scp.jcl.html(cHtml);
		scp.jcl.jcarousel({
			wrap:      '',
			animation: 'slow'
		});

		scp.jcl.jcarousel('reload');

		if (scp.ActiveMeeting == 1) {
		}
		else if (scp.ActiveMeeting > 1) scp.jcl.jcarousel('scroll', '+=' + (scp.ActiveMeeting - 1), false);
		else {
			ClearUI();
		}
	}

});