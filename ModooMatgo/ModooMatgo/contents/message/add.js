/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.msgReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.myUid == null || param.oppUid == null || param.type == null || param.message == null ) {
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
	var myUid = new BigNumber( param.myUid );
	var oppUid = new BigNumber( param.oppUid );
	
	var query = "EXEC [dbo].[UP_MESSAGE_ADD] @sendUid=" + myUid + ", @recvUid=" + oppUid + ", @msgType = " + param.type + ", @msgString='" + param.message + "'";
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
		output.success = true;
		output.code = 0;
		cb( null );        
	});	
			
}
 