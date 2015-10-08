/**
 * New node file
 */

 var fs = require('fs');
 var winston = require('winston');
 var du = require('date-utils');
 
 global.logger = new (winston.Logger)({
 	transports: [
 		new (winston.transports.Console)({
 			level:config.server.loglevel, colorize: true, timestamp: true
 		}),
 		new (winston.transports.File)({
 			filename: makeLogFile(), maxsize: 1024*1024*100, level:config.server.loglevel, timestamp: true
 		})
 	]
 });
 
 function makeLogFile() {
 	var path = process.cwd(); 	
 	if ( !fs.existsSync(path + '/log') ) {
 		fs.mkdir(path + '/log', 0755);
 	} 	
 	var dt = new Date();
	return (path + '/log/log_' + dt.toFormat('YYYYMMDD_HH24MISS') + '.txt');	
 };