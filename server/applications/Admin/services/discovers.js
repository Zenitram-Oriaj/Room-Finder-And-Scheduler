/**
 * Created by Jairo Martinez on 8/25/14.
 */

exports.get = function (req, res) {
	db.Discover.findAll({where: {typeDev: 'IPS'}}).then(
		function(c){
			if (c) {
				var ctrls = [];
				for (var i in c) {
					if (c[i].added == 'no') {
						var p = c[i].addresses.indexOf(',');
						if (p > -1) {
							c[i].addresses = c[i].addresses.substr(0, p);
						}
						ctrls.push(c[i]);
					}
				}
				res.status(200).json(ctrls);
			} else {
				res.status(404).json({});
			}
		},
		function(err){
			var log = new po.SysLog('admin', 'error', 'Failed To Collect All Discovered Controllers');
			updateSysLog(log);

			res.status(500).json(err);
		});
};

exports.post = function (req, res) {

};

exports.put = function (req, res) {

};
