/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('animateIcon', function () {
	return {
		link: function (s, e, a) {
			e.bind('click', function () {
				e.addClass('fa-spin');
				setTimeout(function () {
					e.removeClass('fa-spin');
				}, 2000)
			});
		}
	};
});