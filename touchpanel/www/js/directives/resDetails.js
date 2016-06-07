/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('resDetails', function () {
	return {
		restrict: 'E',
		scope:    false,
		template: '<div class = "alert alert-info" style="height: 100%">' +
		          '<p>Start Time Is Set To: {{res.startTime | date:\'shortTime\' }}</p>' +
		          '<p>Stop Time Is Set To: {{res.stopTime | date:\'shortTime\' }}</p>' +
		          '<p>Meeting Duration Is: {{minutes}} Minutes</p>' +
		          '<p>Host Name will show up as: AMX</p>' +
		          '</div>'
	}
});