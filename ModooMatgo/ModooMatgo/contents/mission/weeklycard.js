/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.weeklycardReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	async.waterfall([
        function( cb ) {
            db(param, output, cb);
        }        
    ], function (err, result) {
		if ( err ) {			
			logger.warn(err);	
		}
		
		helper.sendResponse(req, res, output);
    });
}

module.exports.method = method;

function db(param, output, cb) {
	var query = "EXEC [dbo].[UP_MISSION_WEEKLY_GET]";
	
	mssql.query2( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null );
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
		output.result.missionCard = record.missionCardIndex;
		cb(null);
	});
}