/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('meetingInfo', function () {
	return {
		restrict: 'E',
		scope:    {},
		template: '<h2 id = "lblTitle">{{title}}</h2>' +
		          '<h3 id = "lblRunTime">{{runTime}}</h3>',
		link:     function (s, e, a) {
			s.title = 'No Active Meeting';
			s.runTime = '';
		}
	}
});