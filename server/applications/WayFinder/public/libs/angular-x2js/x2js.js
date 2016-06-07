/**
 * Created by Jairo Martinez on 9/18/14.
 */
angular.module('x2js', [])
	.factory('x2jsService', ['$document', '$q', '$rootScope',
		function ($document, $q, $rootScope) {
			var d = $q.defer();

			function onScriptLoad() {
				// Load client in the browser
				$rootScope.$apply(function () {
					d.resolve(window.X2JS);
				});
			}

			// Create a script tag with X2JS as the source
			// and call our onScriptLoad callback when it
			// has been loaded
			var scriptTag = $document[0].createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = 'libs/xml2json/xml2json.js';
			scriptTag.onreadystatechange = function () {
				if (this.readyState == 'complete') onScriptLoad();
			};
			scriptTag.onload = onScriptLoad;

			var s = $document[0].getElementsByTagName('body')[0];
			s.appendChild(scriptTag);

			return {
				X2JS: function () {
					return d.promise;
				}
			};
		}]);