/**
 * Created by Jairo Martinez on 6/11/15.
 */
app.directive('splash', function(){
	return {
		restrict: 'E',
		scope: false,
		templateUrl: 'views/common/splash.html',
		link: function(s){
			setTimeout(function () {
				$('.splash').css('display', 'none');
			}, 3000);
		}
	}
});