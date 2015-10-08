/**
 * New node file
 */
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.sendReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
	if ( param.uid == null || param.pushMsg == null || param.pushTitle == null || param.addition == null ) {
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
	var uid = new BigNumber( param.uid );
	var query = "EXEC [dbo].[UP_PUSH_SINGLE_MESSAGES_ADD_EXT] @uid=" + uid + " ,@title='" + param.pushTitle + "' ,@msg='" + param.pushMsg + "', @addition='" + param.addition + "'";
	
	mssql.query2( query, function(result, rows) {
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