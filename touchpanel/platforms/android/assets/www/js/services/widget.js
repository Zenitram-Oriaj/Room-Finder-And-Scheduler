/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.service('widget', function (timeDate) {
	this.create = function (res) {
		var html = '';
		var wColor = 'default';
		var sTime = timeDate.formatTimeString(res.startTime);
		var inf2 = timeDate.parseHourMinutes(res.duration);

		if (res.status === 'active') {
			wColor = 'active';
		}

		if (res.description && res.description.length > 33) res.description = res.description.substr(0, 30) + "...";

		/////////////////////////////////////////////////////////////////////////////////

		html += '<li class = "widget" ng-click="widgetClick(' + res.id.toString() + ')">';
		html += '<div id = "wStrt" class = "widget-stime">';
		html += '<h3><b>' + sTime + '</b></h3></div>';
		html += '<div class = "widget-title widget-' + wColor + '">';
		html += '<h2>' + res.host + '</h2></div>';
		html += '<div class = "widget-body widget-body-' + wColor + '">';
		html += '<h3>' + res.description + '</h3></div>';
		html += '<div class = "widget-footer widget-body-' + wColor + '">';
		html += '<h5>' + 'Duration: ' + inf2 + '</h5></div>';
		html += '</li>';

		return html;
	}
});