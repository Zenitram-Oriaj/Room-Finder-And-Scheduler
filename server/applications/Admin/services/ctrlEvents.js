/**
 * Created by Jairo Martinez on 12/15/14.
 */

var sqlQuery = "SELECT v1.`id`, v1.`uuid`, (select v2.`state` FROM `agileoffice-gateway`.controllerEvents as v2 " +
	"where v2.`uuid`= v1.`uuid` and v2.`createdAt` < v1.`createdAt` and v1.`state` != v2.`state` order by `createdAt` desc limit 1) as prevEvent, " +
	"v1.`state` as newEvent, " +
	"v1.`createdAt` as occuredAt, " +
	"TIMEDIFF(v1.`createdAt`,(select v2.`createdAt` FROM `agileoffice-gateway`.controllerEvents as v2 " +
	"where v2.`uuid`= v1.`uuid` and v2.`createdAt` < v1.`createdAt` and v1.`state` != v2.`state` order by `createdAt` desc limit 1)) as duration " +
	"FROM `agileoffice-gateway`.controllerEvents as v1 where `uuid`='";

var sqlQryEnd = "' order by `createdAt` desc limit 100;";

function runQuery(uuid, cb) {
	db.sequelize
		.query(sqlQuery + uuid + sqlQryEnd)
		.then(
		function (evts) {
			cb(null,evts);
		},
		function (err) {
			cb(err,null);
		});
}

module.exports.get = function (req, res) {
	var uuid = req.query.uuid;

	runQuery(uuid, function (err, dat) {
		if(err){
			var log = new po.SysLog('admin', 'error', 'Failed To Collect Controller Events');
			updateSysLog(log);

			res.status(500).json({});
		} else {
			res.status(200).json(dat[0]);
		}
	});
};