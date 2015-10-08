/**
 * New node file
 */
 var express = require('express');
 var cluster = require('cluster');
 	helper = require('./Libs/helper');
 	ErrorCode = require('./config/errorcode').ErrorCode;
 	bigint = require('./Libs/bignumber');

 // global
 async = require('async');
 serverIP = getIPAddress();
 
 var numCPUs = 1; 
 if( process.env.NODE_ENV == 'production' ) { 
 	config = require('./config/config_production.js');
 	numCPUs = require('os').cpus().length;
 } 
 else {
 	config = require('./config/config_development.js'); 
 }
 require('./libs/log.js');

var sentinel = require('redis-sentinel');

var endpoints = [
	{host: config.sentinel1.host, port: config.sentinel1.port},
	{host: config.sentinel2.host, port: config.sentinel2.port},
	{host: config.sentinel3.host, port: config.sentinel3.port}
];

var opts = {};

var masterName = 'mymaster';

redisClient = sentinel.createClient(endpoints, masterName, opts);
redisClient .select(config.redis.select, function() { /* ... */ }); 

//var Sentinel = seninel.Sentinel(endpoints);
//var redisClient = Sentinel.createClient(masterName, opts);



 // impl 
 if( cluster.isMaster ) {
	var rankMethod = require('./Implement/rank');
 	rankMethod.getTopRank();
 	//setInterval( rankMethod.getTopRank, 1000*60*5);
	setInterval( rankMethod.getTopRank, 1000*10);
	
	var pfMethod = require('./Implement/platform_check');
	pfMethod.getPlatformState();
	setInterval( pfMethod.getPlatformState, 1000*10);
 	
 	for( var i = 0; i < numCPUs; i++ ) {
 		cluster.fork();
 	}
 	
 	cluster.on( 'death', function( worker ) {
 		logger.info( '[worker:' + worker.pid + '] died' );
 		worker.fork();
 	});
 }
 else {
 	initHttpServer(); 	
 }
 
 
 
 function initHttpServer() {
 	var http = require('http');
  	mssql = require('./Libs/mssqlDB');
 	request = require('request');
 	var app = express();
 	app.use( express.bodyParser() );
 	
 	registRouter( app ); 	
 	
 	process.on( 'starthttp', function() {
		var httpserver = http.createServer( app ).listen( config.server.port, function () {
		    logger.info( "HTTP running at http://127.0.0.1:"
				   	+ config.server.port + " Mode:" + config.server.env);
		});		
		
		httpserver.on("connection", function (socket) {
			socket.setNoDelay(true); 
		});
		
	});
  };
 
 // 차차차에??가?�옴
 function registRouter( app ) { 
	var path = require('path');	
	var walk = require('walk');
	var S = require('string');	
	
	var files = [];
	
	var walker = walk.walk( __dirname + config.server.basedir, { followLinks: false } );
	
	walker.on( 'file', function( root, stat, next ) {		
		var pos = root.indexOf( config.server.basedir );
		var isScript = S(stat.name).right(2).endsWith( 'js' );	// only .js file	
		if ( false == isScript ) 	 
		{	
			next();
			return;
		}
	
		var rel_path = root.substr( pos + config.server.basedir.length, root.length - pos - config.server.basedir.length ) + '/';		
		var uri = rel_path + S( stat.name ).left( stat.name.length - 3 ); // .js ?�거
	
		var func =  require( root + '/' + stat.name );	
		var method = func.method.toLowerCase(),	
		routeFunc = func;
		
		logger.verbose( func.method + ' URI=' + uri );
		app[method]( uri, routeFunc );

	    next();
	});
	
	walker.on( 'end', function() {
		process.emit( 'starthttp' );
	});
}

function getIPAddress() {
	var interfaces = require('os').networkInterfaces();
	for (var devName in interfaces) {
		var iface = interfaces[devName];

		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
				return alias.address;
		}
	}

	return '0.0.0.0';
}
