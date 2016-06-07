/**
 * Created by Jairo Martinez on 8/27/14.
 */
var queStr1 = 'SELECT * FROM `agileoffice-gateway`.systemlogs ORDER BY `id` DESC LIMIT 100;';

exports.logs = function (req, res) {
	var logsList = [];
	var cnt = 0;
	db.sequelize.query(queStr1).then(
		function(raw){
			var logs = raw[0];
			for (var i in logs) {
				cnt += 1;
				var log = {
					id:       cnt.toString(),
					dateTime: logs[i].dateTime,
					level:    logs[i].level,
					lblLevel: logs[i].lblLevel,
					event:    logs[i].event,
					lblEvent: logs[i].lblEvent,
					message:  logs[i].message
				};
				logsList.push(log);
			}
			res.status(200).json(logsList);
		},
		function(err){
			var log = new po.SysLog('admin', 'error', 'Failed To Collect System Logs From DB');
			updateSysLog(log);

			res.status(500).json(err);
	});
};