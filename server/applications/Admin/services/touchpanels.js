/**
 * Created by Jairo Martinez on 5/29/15.
 */
////////////////////////////////////////////////////////
// HTTP Functions

exports.get = function (req, res) {
	db.TouchPanel.findAll().then(
		function (c) {
			if (c && c.length > 0) {
				res.status(200).json(c);
			} else {
				res.status(404).json(null);
			}
		},
		function (err) {
			var log = new po.SysLog('admin', 'error', 'Failed To Collect All Touch Panels');
			updateSysLog(log);

			res.status(500).json(err);
		});
};

exports.fetch = function (req, res) {
	var ws = db.TouchPanel.build({});
	res.status(200).json(ws);
};

exports.create = function (req, res) {

};

exports.update = function (req, res) {

};

exports.remove = function (req, res) {

};