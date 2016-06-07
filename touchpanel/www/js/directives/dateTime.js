/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('dateTime', function ($interval, timeDate) {
	return {
		restrict: 'E',
		scope:    {},
		template: '<h1 id = "lblTime">{{dt | date:\'shortTime\'}}</h1>' +
		          '<h4 id = "lblDate">{{dt | date:\'longDate\'}}</h4>',
		link:     function (s, e, a) {
			s.dt = new Date();

			//s.ao.tzs.tzOffset;

			$interval(function () {
				s.dt = new Date();
			}, 30 * 1000);
		}
	}
});