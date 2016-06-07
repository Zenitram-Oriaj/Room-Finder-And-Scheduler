/**
 * Created by Jairo Martinez on 9/12/14.
 */

var os = require('os');

function InstallApps() {
	var ps = require('child_process');
	ps.exec('sudo apt-get install -y sysstat atsar', function(error, stdout, stderr) {

		var lines = stdout.split("\n");

		if(stderr){
			var errors = stderr.split("\n");
			errors.forEach(function(e){
				console.log('errs :: ' + e);
			});
		}

		lines.forEach(function(l){
			console.log('line :: ' + l);
		});
	});
}

function CheckForApps(){
	if (os.type() == 'Linux') {
		var ps = require('child_process');
		ps.exec('sar -h', function(error, stdout, stderr) {

			var lines = stdout.split("\n");

			if(stderr){
				var errors = stderr.split("\n");
				errors.forEach(function(e){
					console.log('errs :: ' + e);
				});
			}

			for(var a in lines){
				if(lines[a].indexOf('command not ') > -1 || lines[a].indexOf('can be found ') > -1)
				{
					log.UpdateSysLog('localPc','info','Required Apps Not Found :: Requesting Install');
					InstallApps();
				}
			}
		});
	}
}

module.exports.CheckForApps = CheckForApps;