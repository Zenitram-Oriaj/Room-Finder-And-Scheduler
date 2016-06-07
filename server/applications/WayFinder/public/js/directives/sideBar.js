/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('sideBar', function () {
	return {
		restrict:    'E',
		templateUrl: './views/common/sideBar.html',
		controller:  'SideBarCtrl',
		link:        function (s, e, a) {

		}
	};
});