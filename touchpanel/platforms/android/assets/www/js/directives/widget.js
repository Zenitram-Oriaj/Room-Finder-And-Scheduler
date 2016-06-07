/**
 * Created by Jairo Martinez on 6/15/15.
 */
app.directive('widget', function (timeDate) {
	return {
		restrict: 'E',
		scope:    {
			res: '=res'
		},
		template: '<li class = "widget" ng-click="widgetClick(res.id)">' +
		          '<div id = "wStrt" class = "widget-stime">' +
		          '<h3><b>{{sTime}}</b></h3></div>' +
		          '<div class = "widget-title widget-{{wColor}}">' +
		          '<h2>{{res.host}}</h2></div>' +
		          '<div class = "widget-body widget-body-{{wColor}}">' +
		          '<h3>{{res.description}}</h3></div>' +
		          '<div class = "widget-footer widget-body-{{wColor}}">' +
		          '<h4>Duration: {{inf2}}</h4></div>' +
		          '</li>',
		link:     function (s) {
			s.wColor = 'default';
			s.sTime = timeDate.formatTimeString(s.res.startTime);
			s.inf2 = timeDate.parseHourMinutes(s.res.duration);

			if (s.res.status === 'active') {
				s.wColor = 'active';
			}

			if (s.res.description && s.res.description.length > 33) s.res.description = s.res.description.substr(0, 30) + "...";
		}
	}
});