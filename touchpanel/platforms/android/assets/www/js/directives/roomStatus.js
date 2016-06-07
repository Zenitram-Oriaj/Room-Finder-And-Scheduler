/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.directive('roomStatus', function ($interval, data) {
	return {
		restrict: 'E',
		scope:    false,
		template: '<h3 id = "lblStatus">{{ao.status}}</h3>',
		link:     function (s, e, a) {
			s.status = 'Unoccupied';

			$interval(function(){
				data.info(s.ao.reserveId, s.ao.url).then(
					function(res){
						var val = res.data.status;
						if(val == 1){
							s.ao.status = 'Occupied';
						} else {
							s.ao.status = 'Unoccupied';
						}
					},
					function(err){
						s.ao.commErr = true;
						s.ao.status = 'UNKNOWN';
					});
			},5000);
		}
	}
});