/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('stock', function () {
	return {
		restrict:    'E',
		templateUrl: './views/widgets/stock.html',
		scope: {
			name: '='
		},
		controller:  function ($scope, $interval, $http) {
			$scope.quotes = [];
			$scope.dir = 'down';
			$scope.stckColor = 'red';
			$scope.quote = {
				Ask:             0.00,
				AskRealtime:     0.00,
				DaysHigh:        0.00,
				DaysLow:         0.00,
				ChangeinPercent: "+0.00"
			};

			$scope.opts = {
				showScale:       true,
				scaleOverride:   true,
				scaleSteps:      2,
				scaleStepWidth:  2,
				scaleStartValue: 0
			};

			var init = false;
			var preVal = $scope.quote;

			$scope.lineChartData = {
				labels:   ['15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'now'],
				datasets: [{
					label:                "Stock Data",
					fillColor:            "rgba(220,220,220,0.2)",
					strokeColor:          "rgba(220,220,220,1)",
					pointColor:           "rgba(220,220,220,1)",
					pointStrokeColor:     "#fff",
					pointHighlightFill:   "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data:                 [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
				}]
			};

			$scope.stockChart = $scope.lineChartData;

			$scope.updateChart = function () {
				var tDat = [];
				$scope.quotes.push($scope.quote);
				if ($scope.quotes.length > 16) $scope.quotes.shift();

				$scope.quotes.forEach(function (q) {
					tDat.push(parseFloat(q.Ask));
				});
				$scope.lineChartData.datasets[0].data = tDat;
				$scope.stockChart = $scope.lineChartData;
			};

			$scope.getStock = function (id) {
				if(id){
					var obj = {
						id: id
					};
					var url = './api/widgets/stock';

					$http.post(url,obj).
						success(function(data) {
							var i = -1;
							var a = parseFloat(data.query.results.quote.Ask);
							var b = parseFloat(preVal.Ask);
							var c = a - b;

							c = c.toFixed(2);

							// console.log(data.query.results.quote);

							if (c > 0) data.query.results.quote.ChangeinPercent = '+' + c.toString();
							else data.query.results.quote.ChangeinPercent = c.toString();

							if (init == false) {
								$scope.opts.scaleStartValue = Math.round(a - 2);
								init = true;
							}

							$scope.quote = data.query.results.quote;

							if($scope.quote.Name && $scope.quote.Name.length > 18){
								$scope.quote.Name = $scope.quote.Name.substring(0,17);
								if($scope.quote.Name[16] != ' ') $scope.quote.Name += '.'
							}

							i = $scope.quote.ChangeinPercent.indexOf('+');
							if (i >= 0) {
								$scope.dir = 'up';
								$scope.stckColor = 'green';
							} else {
								$scope.dir = 'down';
								$scope.stckColor = 'red';
							}

							preVal = $scope.quote;
							$scope.updateChart();
						}).
						error(function(data, status, headers, config) {

						});
				}
			};

			$scope.intv = $interval(function () {
				$scope.getStock($scope.name);
			}, 60 * 1000);

			$scope.getStock($scope.name);
			setTimeout(function(){ $scope.getStock($scope.name) },1000);

			$scope.$on('$destroy', function(){
				$interval.cancel($scope.intv);
			});
		}
	};
});