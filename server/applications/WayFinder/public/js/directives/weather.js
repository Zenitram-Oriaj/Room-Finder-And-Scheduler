/**
 * Created by Jairo Martinez on 6/15/15.
 *
 0  tornado
 1  tropical storm
 2  hurricane
 3  severe thunderstorms
 4  thunderstorms
 5  mixed rain and snow
 6  mixed rain and sleet
 7  mixed snow and sleet
 8  freezing drizzle
 9  drizzle
 10  freezing rain
 11  showers
 12  showers
 13  snow flurries
 14  light snow showers
 15  blowing snow
 16  snow
 17  hail
 18  sleet
 19  dust
 20  foggy
 21  haze
 22  smoky
 23  blustery
 24  windy
 25  cold
 26  cloudy
 27  mostly cloudy (night)
 28  mostly cloudy (day)
 29  partly cloudy (night)
 30  partly cloudy (day)
 31  clear (night)
 32  sunny
 33  fair (night)
 34  fair (day)
 35  mixed rain and hail
 36  hot
 37  isolated thunderstorms
 38  scattered thunderstorms
 39  scattered thunderstorms
 40  scattered showers
 41  heavy snow
 42  scattered snow showers
 43  heavy snow
 44  partly cloudy
 45  thundershowers
 46  snow showers
 47  isolated thundershowers
 3200  not available

 https://query.yahooapis.com/v1/public/yql
 ?q=select%20*%20from%20weather.forecast%20where%20location%3D%2245342%22%20and%20u%3D%22c%22
 &format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=

 https://query.yahooapis.com/v1/public/yql
 ?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22 + + %22)
 &format=json

 http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22geneva, switzerland%22)%20and%20u%3D%22c%22&format=json
 */

app.directive('weather', function () {
	return {
		restrict:    'E',
		scope:       {
			location: '=',
			units:    '='
		},
		templateUrl: './views/widgets/weather.html',
		controller:  function ($scope, $interval, $http) {
			$scope.wthr = {};
			$scope.wthr.wd = {
				lastUpdate: Date.now()
			};

			$scope.getWeather = function (id) {
				if (id) {
					var obj = {
						id:    id,
						units: $scope.units || 'f'
					};

					var url = './api/widgets/weather';

					$http.post(url,obj).
						success(function (dat) {
             console.info(dat);
							$scope.wthr.wd = dat;
							var i = $scope.wthr.wd.query.results.channel.item.title.indexOf('at');
							$scope.wthr.wd.title = $scope.wthr.wd.query.results.channel.item.title.substring(0, i);
						}).
						error(function (data, status, headers, config) {
							console.error(data);
						});
				}
			};

			$scope.intv = $interval(function () {
				$scope.getWeather($scope.location);
			}, 30 * 60 * 1000); // Check Every 30 Mins

			$scope.getWeather($scope.location);

			$scope.$on('$destroy', function () {
				$interval.cancel($scope.intv);
			});
		}
	};
});

