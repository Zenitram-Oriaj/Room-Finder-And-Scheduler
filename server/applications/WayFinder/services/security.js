/**
 * Created by Jairo Martinez on 6/16/15.
 */

var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var log = {};

//
/////////////////////////////////////////////////////////////////

function createToken(email) {
	var expires = new Date();
	expires.setHours(expires.getHours() + 8);
	var token = jwt.encode({
		userName: email,
		expires:  expires
	}, 'A34B22D4F3E23');

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
			log = new po.SysLog('wayfinder', 'error', 'Failed To Save Token');
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
		function (res) {
			if (res) {
				cb(null, res);
			} else {
				cb(null, null);
			}
		},
		function (err) {
			log = new po.SysLog('wayfinder', 'error', 'Failed To Find User :: ' + e);
			updateSysLog(log);
			cb(err, null);
		});
}

function challenge(tk, cb) {
	var r = new po.Result();

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
						r.data = token.token;
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
		var r = new po.Result();
		if (err) {
			r.code = 500;
			r.message = 'Error : Occurred While Searching For User';
			r.error = err;
			return cb(r);
		} else {
			if (u == null) {
				log = new po.SysLog('wayfinder', 'warning', 'Unable To Find User :: ' + t.email);
				updateSysLog(log);

				r.code = 404;
				r.message = 'Unable To Find User';
				return cb(r);
			} else {
				if (bcrypt.compareSync(t.password, u.password)) {
					log = new po.SysLog('wayfinder', 'success', 'User Has Logged In :: ' + user.email);
					updateSysLog(log);

					r.code = 200;
					r.data = createToken(u.email);
					return cb(r);
				} else {
					log = new po.SysLog('wayfinder', 'warning', 'User Has Failed To Authenticate :: ' + user.email);
					updateSysLog(log);

					r.code = 401;
					r.message = 'FAILED TO AUTHENTICATE';
					return cb(r);
				}
			}
		}
	});
}

//
/////////////////////////////////////////////////////////////////

module.exports.login = function(req,res){
	try {
		var user = {
			email:    req.body.email,
			password: req.body.pass
		};
		authenticate(user, function (r) {
			res.status(r.code).json(r);
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};

module.exports.challenge = function(req,res){
	try {
		var tk = {
			email: req.body.email,
			token: req.body.token
		};
		challenge(tk, function (r) {
			res.status(r.code).json(r);
		});
	}
	catch(ex) {
		res.status(500).json(ex);
	}
};
