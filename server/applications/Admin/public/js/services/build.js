/**
 * Created by Jairo Martinez on 6/12/15.
 */
app.service('build', function(){
	this.address = function(loc){
		var addr = '';

		if(loc.address.length > 0){
			addr += loc.address;
			addr += ', ';
		}

		if(loc.city.length > 0){
			addr += loc.city;
			addr += ', ';
		}
		if(loc.state.length > 0){
			addr += loc.state;
			addr += ' ';
		}
		if(loc.zipcode.length > 0){
			addr += loc.zipcode;
		}
		if(loc.country.length > 0){
			addr += ', ';
			addr += loc.country;
		}
		return addr;
	}
});