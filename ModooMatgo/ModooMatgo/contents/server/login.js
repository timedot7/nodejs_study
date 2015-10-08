
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.loginReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
	// CN을 입력받는다
	if ( param.cn == null ) {
		output.success = false;
		output.code = ErrorCode.PARAM_INVALID;
		helper.sendResponse(req, res, output);
		return;
	}
	
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
	var query = "EXEC [dbo].[UP_PLAYER_CHECK_BY_CN] @cn=" + '\'' + param.cn + '\'' ;
	
	mssql.query( query, function(result, rows) {

		if( result.success == false ) {
			output.success = false;
			output.code = result.code;	
			cb( null, output );
			return;
		}
		 
		if( rows == null ) {
			output.success = false;
			output.code = ErrorCode.DB_NO_RESULTS;
	 		cb( null, output );        
			return;			
		}
		
		output.result = [];
		
		for( var i = 0; i < rows.length; i++ ) {
			var record = eval(rows[i]);
			output.result[i] = {};
			output.result[i].result		= record.result;
			output.result[i].serverID	= record.serverID;
			output.result[i].serverIP	= '172.30.24.36';//record.serverIP;
			output.result[i].serverPort	= record.serverPort;
			output.result[i].roomNo		= record.roomNo;
			output.result[i].stateUpdatedSec	= record.stateUpdatedSec;
			output.result[i].resultDetail	= record.resultDetail;
		}
		cb( null );
	});
}

