/**
 * Created by Jairo Martinez on 5/20/15.
 */
app.filter('accesslevel', function () {
	return function (level) {
		switch(level){
			case 1: return 'success';
			case 2: return 'info';
			case 3: return 'warning';
			case 4: return 'danger';
			default : return 'default';
		}
	}
});

app.filter('types', function () {
	return function (type, typeList) {
		var id = type || 0;

		if(typeList[id].name === undefined) typeList[id].name = '';

		return typeList[id].name;
	}
});

app.filter('timeZones', function () {
	return function (tz, tzList) {
		var id = type || 0;

		if(typeList[id].name === undefined) typeList[id].name = '';

		return typeList[id].name;
	}
});

app.filter('state', function () {
	return function (val) {
		switch(val){
			case 0: return 'available';
			case 1: return 'occupied';
			default : return 'unknown';
		}
	}
});