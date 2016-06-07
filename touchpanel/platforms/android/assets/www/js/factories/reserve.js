/**
 * Created by Jairo Martinez on 6/15/15.
 */

app.factory('reserve', function(){
	var reserve = {
		"uuid":       "",
		"title":       "Local Reservation",
		"startTime":   "",
		"stopTime":    "",
		"duration":    0,
		"host":        "Agile Office",
		"description": "A reservation made from room's touchpanel."
	};

	reserve.active = function(){
		var dt = new Date();
		var ds = Date.parse(this.startTime);
		var dn = Date.parse(this.stopTime);
		return(dt >= ds && dt < dn);
	};

	return reserve;
});