var debugLevel = 4;

function Item(){
	this.level = '';
	this.lblEvent = '';
	this.event = '';
	this.lblLevel = '';
	this.message = '';
}

function GetDateTimeStr(dt){

	var yy = dt.getFullYear();
	var mm = dt.getMonth() + 1;
	var dd = dt.getDate();

	var hh = dt.getHours();
	var nn = dt.getMinutes();
	var ss = dt.getSeconds();

	if(dd < 10) dd = '0' + dd;
	if(mm < 10) mm = '0' + mm;
	if(hh < 10) hh = '0' + hh;
	if(nn < 10) nn = '0' + nn;
	if(ss < 10) ss = '0' + ss;

	return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + nn + ':' + ss;
}

module.exports.DebugLevel = debugLevel;

module.exports.UpdateSysLog = function (event, level, msg) {
	var item = new Item();

	item.event = event;
	item.message = msg;

	switch (item.event) {
		case 'controller': {
			item.lblEvent = 'success';
			break;
		}
		case 'localPc': {
			item.lblEvent = 'default';
			break;
		}
		case 'scheduler': {
			item.lblEvent = 'warning';
			break;
		}
		case 'discover': {
			item.lblEvent = 'primary2';
			break;
		}
		case 'wayFinder': {
			item.lblEvent = 'info';
			break;
		}
		case 'admin': {
			item.lblEvent = 'primary';
			break;
		}
		case 'server': {
			item.lblEvent = 'danger';
			break;
		}
		default : {
			item.lblEvent = 'default';
			break;
		}
	}

	switch (level) {
		case 'success':{
			item.level = 'okay';
			item.lblLevel = 'success';
			break;
		}
		case 'info':{
			item.level = 'info';
			item.lblLevel = 'info';
			break;
		}
		case 'warning':{
			item.level = 'warn';
			item.lblLevel = 'warning';
			break;
		}
		case 'error':{
			item.level = 'error';
			item.lblLevel = 'danger';
			break;
		}
		default:{
			item.level = 'error';
			item.lblLevel = 'danger';
			break;
		}
	}

	db.SystemLog
		.create({
			level:    item.level,
			lblLevel: item.lblLevel,
			event:    item.event,
			lblEvent: item.lblEvent,
			message:  item.message
		})
		.then(
		function (str) {

		},
		function (err) {
			console.log(err);
		});
};

module.exports.UpdateConsole = function (logLevel, Src, Message) {
	if (debugLevel && debugLevel >= logLevel) {
		var dt = new Date();
		switch (logLevel) {
			case 1:{
				console.error(GetDateTimeStr(dt) + ' :: ' +  Src + ' :: ERROR :: ' + Message);
				break;
			}
			case 2:{
				console.warn(GetDateTimeStr(dt) + ' :: ' +  Src + ' :: WARN  :: ' + Message);
				break;
			}
			case 3:{
				console.log(GetDateTimeStr(dt) + ' :: ' +  Src + ' :: DATA  :: ' + Message);
				break;
			}
			case 4:{
				console.info(GetDateTimeStr(dt) + ' :: ' +  Src + ' :: INFO  :: ' + Message);
				break;
			}
			default:{
				console.error(GetDateTimeStr(dt) + ' :: ' +  Src + ' :: ????  :: ' + Message);
				break;
			}
		}
	}
};