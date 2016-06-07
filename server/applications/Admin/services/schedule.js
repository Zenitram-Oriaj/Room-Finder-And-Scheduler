/**
 * Created by Jairo Martinez on 6/2/15.
 */

function CollectReservationsByWs(id, cb) {
	var r = new po.Result();
	r.data = [];

	db.Reservation
		.findAll({where: {resourceId: id}})
		.then(
		function (res) {
			if (res) {
				cb(null, res);
			} else {
				console.error('CollectReservationsByWs() :: ERROR');
				cb(null, []);
			}
		},
		function (err) {
			var log = new po.SysLog('admin', 'error', 'Failed To Collect Reservations For ID :: ' + id.toString());
			updateSysLog(log);

			r.code = 500;
			r.message = "Error Get Schedule Data";
			r.data = err;
			cb(err, r);
		});
}

exports.get = function (req, res) {
	var r = new po.Result();
	var resId = req.params.resId;

	CollectReservationsByWs(resId, function (err, dat) {
		if (err) {
			r.code = 500;
			r.message = err;
			r.data = {};
		} else {
			r.code = 200;
			r.message = "Room Is Reservable";
			r.data = dat.data;
		}

		res.status(r.code).json(dat);
	});
};

exports.fetch = function (req, res) {
	var ws = db.Reservation.build({});
	res.status(200).json(ws);
};
