/**
 * Created by Jairo Martinez on 9/12/14.
 */

function CheckDBSingle() {
	db.ControllerEvent
		.find({where: {state: 'PENDING'}})
		.then(
		function(sensorEvt){
			if (sensorEvt) {
				sensorEvt.state = 'COMPLETED';
				sensorEvt.processedAt = new Date();
				sensorEvt.save().then(function(result){},function(err){});
			}
		},
		function(err){
			console.error('CheckDBSingle() :: ' + err);
		});
}

module.exports.init = function(cfg){
	setInterval(function () {
		CheckDBSingle();
	}, 1000);
};