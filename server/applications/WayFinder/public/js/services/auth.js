/**
 * Created by Jairo Martinez on 6/16/15.
 */
app.service('auth', function($http){

	this.login = function(creds){
		return $http.post('./login',creds)
	};

	this.challenge = function(user){
		return $http.post('./challenge',user)
	};

	this.logout = function(user){
		return $http.post('./logout',user)
	};
});