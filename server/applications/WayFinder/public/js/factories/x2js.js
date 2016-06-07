/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.factory('X2JS', function ($window) {
	var X2JS = {};
	if($window.X2JS){
		//X2JS = $.extend({}, $window.X2JS());
		X2JS = $window.X2JS;
	}
	return X2JS;
});
