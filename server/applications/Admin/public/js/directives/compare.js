/**
 * Created by Jairo Martinez on 6/10/15.
 */
app.directive('compare', function () {
	return {
		require: "ngModel",
		restrict: 'A',
		scope:   {
			refVal: "=compare"
		},
		link:    function (s, e, a, ngModel) {

			ngModel.$validators.compare = function (v) {
				return v == s.refVal;
			};

			s.$watch("refVal", function () {
				ngModel.$validate();
			});
		}
	};
});