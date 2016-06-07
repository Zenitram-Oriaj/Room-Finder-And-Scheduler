app.service('auth', function ($http) {
	this.login = function (user) {
		return $http.post('/login', {email: user.email, password: user.pass});
	};

	this.register = function (user) {
		return $http.post('/register', user);
	};

	this.updateUser = function (user) {
		return $http.post('/updateUser', user);
	};

	this.updatePass = function (pass) {
		return $http.post('/updatePass', pass);
	};

	this.getUser = function (email) {
		return $http.post('/getUser', {email: email});
	};

	this.deleteUser = function (user) {
		return $http.post('/deleteUser', {email: user.email});
	};

	this.collectUsers = function () {
		return $http.get('/collectUsers');
	};

	this.challenge = function (tk) {
		return $http.post('/challenge', {token: tk.token, email: tk.email});
	};

	this.logout = function (token) {
		return $http.post('/logout', {token: token});
	};
});
