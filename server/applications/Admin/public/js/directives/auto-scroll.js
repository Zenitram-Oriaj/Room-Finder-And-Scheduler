/**
 * Created by Jairo Martinez on 6/8/15.
 */

app.directive('autoScroll', function () {
	return {
		restrict:   'A',
		scope:      false,
		link:       function (s, e, a) {
			var el = e[0];
			var id = a.id;

			s.$watch(function(n,o){
				$('#' + id).scrollTop(el.scrollHeight);
			});
		}
	}
});