/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {

	var output = { 
		success : true,
		code : 0
	};

	async.waterfall([
        function( cb ) {
            db(output, cb);
        }        
    ], function (err, result) {
		if ( err ) {			
			logger.warn(err);	
		}
	
		helper.sendResponse(req, res, output);
    });   
}

module.exports.method = method;

function db(output, cb) {
	
	var query = "EXEC [dbo].[UP_CURRENT_TIME_GET]";
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
		
		if( rows == null || rows.length != 1 ) {
			output.success = false;
			output.code = ErrorCode.DB_NO_RESULTS;
	 		cb( null, output );        
			return;				
		}
				
		var record = eval(rows[0]);
		output.result = {};
		output.result.time = record.curTime;
		cb( null );
	});	
			
}
 