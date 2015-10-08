/**
 * New node file
 */

 var poolModule = require('generic-pool');
  
 var MSSQL = function() {
  	
 	var conn_str;
 	var conn_str2;
 
 	function init() {
	  	conn_str = 'Driver={' + config.mssql.driver + '};'; 
		conn_str +=	'Server='+ config.mssql.host + ',' + config.mssql.port + ';'; 
		conn_str +=	'Database={' + config.mssql.database + '};'; 
	  	conn_str +=	'Uid={' + config.mssql.user + '};';
		conn_str +=	'Pwd={' + config.mssql.password + '};';
		
	  	conn_str2 = 'Driver={' + config.mssql.driver + '};'; 
		conn_str2 += 'Server='+ config.mssql.host + ',' + config.mssql.port + ';'; 
		conn_str2 += 'Database={' + config.mssql.databasecommnuity + '};'; 
	  	conn_str2 += 'Uid={' + config.mssql.user + '};';
		conn_str2 += 'Pwd={' + config.mssql.password + '};';
 	};
 	init();
	
 	var pool = poolModule.Pool( {
 		name : 'mssql',
 		max  : config.dbpool.max,
 		min  : config.dbpool.min,
 		log  : false, 		 
 		idleTimeoutMillis : config.dbpool.timeout,
 		
 		create : function( callback ) {

		var client = require('msnodesql');
 			client.open( conn_str, function( err, conn ) {
 				if ( err ) {
 					logger.warn( '[Error] DB connection failed! conn_str:' + conn_str );
 					return;
 				}
 				//logger.info( '[DBPool] created! conn_str:' + conn_str );
 				callback( err, conn );
 			});
 		},
 		destroy  : function( client ) {
		   	client.close(); 
		   	//logger.info( '[DBPool] destroy' );
		}		
 	});
 	
 	this.query = function( query, callback ) { // callback( output,
 		var result = {
 			success : true,
 			errormsg : '',
 			code : 0
 		}; 		 

	  	pool.acquire( function(err, conn) {
	 		if( err ) {
	 			helper.setOutputError( result, 'acquire failed! error:' + err, 1 );
	 			logger.warn( '[Error] msg:' + result.errormsg + ' code:' + result.code );

	 			callback( result, null );
	 			pool.release( conn );		
	 			return;
	 		}
	 		
	 		conn.query( query, function( err, rows ) {
	 			if ( err ) {
		 			helper.setOutputError( result, 'query failed! error:' + err, ErrorCode.DB_QUERY_FAILED );
	 				logger.warn( '[Error] query:' + query + ' msg:' + result.errormsg + ' code:' + result.code );

	 				// Conntion Error
		 			if (0 > err.toString().indexOf('Communication link failure')) {
		 				logger.warn( 'refresh DBPool');
		 				pool.destroy(conn);
						callback( result, null );
						return;
		 			}

				 	pool.release( conn );
	 				callback( result, null );
	 				return;				 	 				
	 			}
	 			else {
				 	pool.release( conn );
	 				callback( result, rows );
	 			}
	 		});
	 			 		
	 	});	 	
	};	
	return this;
 };
 
 
 module.exports = MSSQL();