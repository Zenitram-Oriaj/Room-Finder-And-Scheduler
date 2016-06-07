/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('resNotes', function () {
	return {
		restrict: 'E',
		scope:    false,
		template: '<h4>Notes:</h4>' +
		          '<h4><b>The maximum allowed local reservation duration is 2 hours (120 minutes).</b></h4>'
	}
});