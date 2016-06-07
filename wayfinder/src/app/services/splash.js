/**
 * Created by Jairo Martinez on 6/11/15.
 */
app.directive('splash', function () {
	return {
		restrict:    'E',
		transclude: true,
		scope:       {
			timeout: '@'
		},
		templateUrl: 'views/splash.html',
		link:        function (s) {
			if (!s.timeout) s.timeout = 3;

			setTimeout(function () {
				$('.splash').css('display', 'none');
			}, s.timeout * 1000);
		}
	}
});