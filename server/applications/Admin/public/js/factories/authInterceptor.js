/**
 * Created by Jairo Martinez on 6/1/15.
 */
app.factory('authInterceptor', function ($q, $location) {
	return {
		request:       function (config) {
			config.headers = config.headers || {};
			if (sessionStorage.access_token) {
				config.headers.access_token = sessionStorage.access_token;
			}
			return config;
		},
		responseError: function (res) {
			if (res.status === 401) {
				$location.path('/login');
			}
			return $q.reject(res);
		}
	}
});
