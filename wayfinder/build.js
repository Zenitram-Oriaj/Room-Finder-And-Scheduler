/**
 * Created by Jairo Martinez on 7/26/15.
 */

var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
	files: './src/**/**',
	platforms: ['osx64', 'win32', 'win64'],
	appName: 'WayFinder',
	appVersion: '0.2.1'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
	console.log('all done!');
}).catch(function (error) {
	console.error(error);
});