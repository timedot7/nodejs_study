/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.reportReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
	if ( param.myUid == null || param.error == null ) {
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

	var uid = new BigNumber( param.myUid );
	var query = "EXEC [dbo].[UP_USER_ERRORS_ADD] @myUid=" + uid + ",@error=" + '\'' + param.error + '\'';

	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
				
		output.result = {};			
		output.result.error 	= 0;
		cb( null );
	});
}
