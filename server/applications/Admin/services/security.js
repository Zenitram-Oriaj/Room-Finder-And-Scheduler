var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var _ = require('underscore');
var log = {};

function Result() {
	this.code = 0;
	this.message = '';
	this.token = '';
	this.user = {
		token:       '',
		admin:       '',
		username:    '',
		firstName:   '',
		lastName:    '',
		email:       '',
		title:       '',
		phone:       '',
		accessLevel: 0,
		agree:       0,
		lastLoginAt: new Date()
	};
}

function init() {
	setInterval(checkTokens, 15 * 60 * 1000);
}

function checkTokens() {
	var dt = new Date();
	db.Token.findAll().then(
		function (res) {
			if (res.length > 0) {
				res.forEach(function (t) {
					if (dt > t.expiresAt) {
						t.status = 'expired';
						t.save();
					}
				});
			}
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Collect Tokens');
			updateSysLog(log);
		});
}

function createToken(email) {
	var expires = new Date();
	expires.setHours(expires.getHours() + 8);
	var token = jwt.encode({
		userName: email,
		expires:  expires
	}, app.get('jwtTokenSecret'));

	db.Token
		.create({
			email:     email,
			token:     token,
			status:    'active',
			expiresAt: expires
		})
		.then(
		function (s) {

		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Save New Token To DB');
			updateSysLog(log);
		});

	return token;
}

function findToken(tk, cb) {
	db.Token
		.find({where: {token: tk}})
		.then(
		function (s) {
			if (s) {
				cb(null, s);
			} else {
				cb(null, null);
			}
		},
		function (err) {
			cb(err, null);
		});
}

function findUser(email, cb) {
	var e = email.toLowerCase();
	db.User
		.find({where: {email: e}})
		.then(
		function (user) {
			if (user) {
				cb(null, user);
			} else {
				cb(null, null);
			}
		},
		function (err) {
			log = new po.SysLog('admin', 'error', 'Failed To Get User :: ' + e);
			updateSysLog(log);

			cb(err, null);
		});
}

function challenge(tk, cb) {
	var r = new Result();

	if (tk.token == 'undefined') {
		r.code = 500;
		r.message = 'No Token Was Defined In Request';
		r.data = tk;
		return cb(r);
	} else {
		findToken(tk.token, function (err, token) {
			if (err) {
				r.code = 500;
				r.message = "Error Occured While Locating Token";
				cb(r);
			}
			else if (token == null) {
				r.code = 401;
				r.message = "No matching token found";
				cb(r);
			} else {
				if (token.status == 'active') {
					findUser(tk.email, function (err, user) {
						r.code = 200;
						r.message = 'Token Passed';
						r.user = user;
						r.token = token.token;
						r.error = err;
						cb(r);
					});
				} else {
					r.code = 401;
					r.message = 'Session Has Expired.';
					cb(r);
				}
			}
		});
	}
}

function authenticate(user, cb) {
	var t = user;

	findUser(t.email, function (err, u) {
		var r = new Result();
		if (err) {
			log = new po.SysLog('admin', 'error', 'Error Occurred While Finding User :: ' + user.email);
			updateSysLog(log);

			r.code = 500;
			r.error = err;

			return cb(r);
		} else {
			if (u == null) {
				log = new po.SysLog('admin', 'warning', 'Ubable To Find User :: ' + user.email);
				updateSysLog(log);

				r.code = 404;
				r.message = 'Unable To Find User';
				return cb(r);
			} else {
				if (bcrypt.compareSync(t.password, u.password)) {
					r.code = 200;
					r.user = {
						admin:       u.admin,
						username:    u.username,
						firstName:   u.firstName,
						lastName:    u.lastName,
						email:       u.email,
						title:       u.title,
						phone:       u.phone,
						accessLevel: u.accessLevel,
						agree:       u.agree,
						lastLoginAt: u.lastLoginAt || new Date()
					};

					r.token = createToken(u.email);

					u.loginCount += 1;
					u.lastLoginAt = new Date();
					u.save();

					log = new po.SysLog('admin', 'success', 'User Has Logged In :: ' + user.email);
					updateSysLog(log);

					return cb(r);
				} else {
					log = new po.SysLog('admin', 'warning', 'User Has Failed To Authenticate :: ' + user.email);
					updateSysLog(log);

					r.code = 401;
					r.message = 'FAILED TO AUTHENTICATE';
					return cb(r);
				}
			}
		}
	});
}

function addUser(user, cb) {
	var r = new Result();
	var t = user;
	findUser(t, function (err, u) {
		var e = '';
		if (err) {
			r.code = 500;
			r.message = 'Error : Occurred While Searching For User';
			r.error = err;
			return cb(r);
		} else {
			if (u == null) {
				e = t.email;
				var h = bcrypt.hashSync(t.password, 10);
				var i = t.email.indexOf('@');
				var n = e.substr(0, i);
				db.User
					.create({
						userName:    n,
						email:       t.email,
						password:    h,
						firstName:   t.firstName,
						lastName:    t.lastName,
						title:       t.title,
						phone:       t.phone,
						accessLevel: t.accessLevel,
						agree:       t.agree,
						admin:       0
					})
					.then(
					function (s) {
						log = new po.SysLog('admin', 'success', 'Added A New User :: ' + t.email);
						updateSysLog(log);

						r.code = 201;
						r.message = 'User Has Been Added';
						r.user = s;
						cb(r);
					},
					function (err) {
						log = new po.SysLog('admin', 'error', 'Failed To Add A New User :: ' + t.email);
						updateSysLog(log);

						r.code = 500;
						r.message = 'Error : Unable To Save User To DB';
						r.error = err;
						return cb(r);
					});
			} else {
				log = new po.SysLog('admin', 'warning', 'E-Mail Address Already Exists :: ' + t.email);
				updateSysLog(log);

				r.code = 409;
				r.message = 'E-Mail Address Already Exists';
				r.user = u;
				return cb(r);
			}
		}
	});
}

function updateUser(user, cb) {
	findUser(user.email, function (err, u) {
		var r = new Result();
		if (u == null) {
			r.code = 404;
			r.message = 'Unable To Find User';
			r.user = user;
			cb(r);
		} else {
			u.firstName = user.firstName;
			u.lastName = user.lastName;
			u.title = user.title;
			u.phone = user.phone;
			u.accessLevel = user.accessLevel;
			u.admin = (user.accessLevel > 3);
			u.save().then(
				function (s) {
					log = new po.SysLog('admin', 'success', 'Updated User :: ' + user.email);
					updateSysLog(log);

					r.code = 200;
					r.message = 'User Has Been Updated';
					r.user = u;
					cb(r);
				},
				function (err) {
					log = new po.SysLog('admin', 'error', 'Failed To Update User :: ' + user.email);
					updateSysLog(log);

					r.code = 500;
					r.message = 'Error Occurred While Updating User';
					r.error = err;
					cb(r);
				});
		}
	})
}

function updatePass(pwd, cb) {
	findUser(pwd.email, function (err, u) {
		var r = new Result();
		if (u == null) {
			r.code = 404;
			r.message = 'Unable To Find User To Compare Passwords';
			cb(r);
		} else {
			if (bcrypt.compareSync(pwd.oldPass, u.password)) {
				u.password = bcrypt.hashSync(pwd.newPass, 10);
				u.save().then(
					function (s) {
						log = new po.SysLog('admin', 'success', 'Updated Password For  :: ' + pwd.email);
						updateSysLog(log);

						r.code = 200;
						r.message = 'Password Has Been Updated';
						cb(r);
					},
					function (err) {
						log = new po.SysLog('admin', 'error', 'Failed To Update Password For  :: ' + pwd.email);
						updateSysLog(log);

						r.code = 500;
						r.message = 'Error Occurred While Updating Password';
						r.error = err;
						cb(r);
					});
			} else {
				log = new po.SysLog('admin', 'error', 'Password Match Failed For :: ' + pwd.email);
				updateSysLog(log);

				r.code = 403;
				r.message = 'Current Password Did NOT Match';
				cb(r);
			}
		}
	});
}

function deleteUser(user, cb) {
	findUser(user, function (err, u) {
		var r = new Result();
		if (u == null) {
			r.code = 404;
			r.message = 'Unable To Find User';
			r.data = user;
			cb(r);
		} else {
			u.destroy().then(
				function (s) {
					log = new po.SysLog('admin', 'success', 'Deleted User :: ' + user.email);
					updateSysLog(log);

					r.code = 200;
					r.message = 'Deleted User From Database';
					r.data = user;
					cb(r);
				},
				function (err) {
					log = new po.SysLog('admin', 'error', 'Failed To Delete User :: ' + user.email);
					updateSysLog(log);

					r.code = 500;
					r.message = 'Failed To Delete User';
					r.error = err;
					cb(r);
				});
		}
	});
}

function collectUsers(cb) {
	db.User.findAll().then(
		function (u) {
			if (u) {
				cb(u);
			} else {
				cb(null);
			}
		},
		function (err) {
			log = new po.SysLog('admin', 'success', 'Failed To Collect All Users');
			updateSysLog(log);

			cb(null);
		});
}

init();

// Exported Routes
////////////////////////////////////////////////////

module.exports.findUser = function (req, res) {
	findUser(req.body.email, function (err, user) {
		if (err) {
			res.status(500).json({
				error:   err,
				message: 'Error While Locating User'
			});
		} else {
			if (user) {
				res.status(200).json({
					user: user
				});
			} else {
				res.status(404).json({
					message: 'Unable To Locate Requested User'
				});
			}
		}
	})
};

module.exports.register = function (req, res) {
	var user = {
		email:       req.body.email,
		password:    req.body.password,
		firstName:   req.body.firstName,
		lastName:    req.body.lastName,
		title:       req.body.title,
		phone:       req.body.phone,
		accessLevel: 1,
		agree:       req.body.agree,
		admin:       false
	};

	addUser(user, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};

module.exports.updateUser = function (req, res) {
	var user = {
		email:     req.body.email,
		firstName: req.body.firstName,
		lastName:  req.body.lastName,
		title:     req.body.title,
		phone:     req.body.phone
	};

	updateUser(user, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};

module.exports.updatePass = function (req, res) {
	var pass = {
		email:   req.body.email,
		newPass: req.body.pass1,
		oldPass: req.body.crnt
	};

	updatePass(pass, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};

module.exports.deleteUser = function (req, res) {
	var user = {
		email: req.body.email
	};

	deleteUser(user, function (r) {
		res.statusCode = r.code;
		res.json(r);
	});
};

module.exports.collect = function (req, res) {
	collectUsers(function (users) {
		if (users !== null) {
			res.statusCode = 200;
			res.json(users);
		} else {
			res.statusCode = 404;
			res.json(null);
		}
	});
};

module.exports.challenge = function (req, res) {
	var tk = {
		email: req.body.email,
		token: req.body.token
	};

	challenge(tk, function (r) {
		res.status(r.code).json(r);
	});
};

module.exports.login = function (req, res) {

	var user = {
		email:    req.body.email,
		password: req.body.password
	};

	authenticate(user, function (r) {
		res.status(r.code).json(r);
	});
};

module.exports.logout = function (req, res) {
	var token = req.body.token;
	res.status(200).json({});
};
