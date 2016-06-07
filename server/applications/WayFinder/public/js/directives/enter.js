/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('enter', function () {
	return {
		restrict: 'A',
		link:     function (s, e, a) {
			e.bind('mouseenter', function () {
				e.addClass(a.enter);
			})
		}
	}
});