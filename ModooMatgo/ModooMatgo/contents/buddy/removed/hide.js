/**
 * New node file
 */
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.hideReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
	if ( param.myUid == null || param.buddyUid == null ) {
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
	var buddyUid = new BigNumber( param.buddyUid );
	
	var query = "EXEC [dbo].[spDisableBuddy] @myUid=" + myUid + ",@buddyUid=" + buddyUid;
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
		
		var record = eval(rows[0]);
		output.result = {};
			output.result.result				= record.result;
			output.result.buddyUid		= record.buddyUid;
			output.result.buddyState		= record.buddyState;
			cb( null );        
	});	
}