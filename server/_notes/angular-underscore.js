/**
 * Created by Jairo Martinez on 9/18/14.
 */
angular.module('underscore', [])
	.factory('_', ['$document', '$q', '$rootScope',
		function ($document, $q, $rootScope) {
			var d = $q.defer();

			function onScriptLoad() {
				// Load client in the browser
				$rootScope.$apply(function () {
					d.resolve(window._);
				});
			}

			var scriptTag = $document[0].createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = 'libs/underscore/underscore.js';
			scriptTag.onreadystatechange = function () {
				if (this.readyState == 'complete') onScriptLoad();
			};
			scriptTag.onload = onScriptLoad;

			var s = $document[0].getElementsByTagName('body')[0];
			s.appendChild(scriptTag);

			return {
				_: function () {
					return _.promise;
				}
			};
		}]);