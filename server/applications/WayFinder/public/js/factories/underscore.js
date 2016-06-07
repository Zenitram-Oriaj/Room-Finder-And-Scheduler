/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.factory('_', function ($window) {
	var _ = {};
	if($window._){
		_ = $window._;
	}
	return _;
});