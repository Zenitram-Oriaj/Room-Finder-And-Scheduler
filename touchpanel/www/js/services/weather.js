/**
 * Created by Jairo Martinez on 5/20/15.
 */
app.service('weather', function ($http) {
	this.yahoo = function (locationId) {
		return $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%' + locationId.toString() + '%22&format=json');
	};

	this.forecast = function (lat, log) {
		// API Key: 28d8e8e2b24bf6d955bf34a0bd4fd87c (Does Not Support CORS);
		// 36.1215,-115.1739 Las Vegas

		//return $http.jsonp('https://api.forecast.io/forecast/28d8e8e2b24bf6d955bf34a0bd4fd87c/37.8267,-122.423');
		return $.ajax({
			url:      'https://api.forecast.io/forecast/28d8e8e2b24bf6d955bf34a0bd4fd87c/'+ lat + ',' + log + '?units=us&callback=?',
			dataType: 'json',
			async:    false
		});
	};

	this.openweather = function (zip) {
		// API Key: ddd739e2de60abe4857fbeec21fb65cf
		//  api.openweathermap.org/data/2.5/weather?zip=94040,us

		return $http.get('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&units=imperial');
	}
});