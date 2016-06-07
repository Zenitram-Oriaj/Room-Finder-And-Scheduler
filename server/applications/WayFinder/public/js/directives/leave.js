/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('leave', function () {
	return {
		restrict: 'A',
		link:     function (s, e, a) {
			e.bind('mouseleave', function () {
				e.removeClass(a.enter);
			})
		}
	}
});