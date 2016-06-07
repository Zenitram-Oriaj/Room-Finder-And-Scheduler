/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('carousel', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: false,
		template: '<div class = "jcarousel-wrapper">' +
		          '<div class = "jcarousel">' +
		          '<div class = "widget"></div></div>'+
		          '<a href = "#" class = "jcarousel-control-prev" ng-click="jclPrev()">&lsaquo;</a>' +
		          '<a href = "#" class = "jcarousel-control-next" ng-click="jclNext()">&rsaquo;</a></div>',
		link:     function (s, e, a) {
		}
	}
});
