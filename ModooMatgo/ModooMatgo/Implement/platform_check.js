/**
 * New node file
 */


 var mssql = require('../Libs/mssqlDB');
 var du = require('date-utils');
 
 module.exports.getPlatformState = function() { 	
 	platformCheckQuery();
 };
 
 function platformCheckQuery() {
 	var query = "EXEC [dbo].[UP_PLATFORM_NOTICE_GET]";
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			return;
		}
		
		var output = [];
		
		for( var i = 0; i < rows.length; i++ ) {
			var record = eval(rows[i]);
			output[i] = {};
			output[i].pf	 = record.pf;
			output[i].notice = record.notice;
		}
		/*
		redisClient.set( "platformState", JSON.stringify(output), function(err, reply) {
			if ( err ) {
				logger.warn( '[Error] redis:' + err );
			}
		});
		*/
	});
 }