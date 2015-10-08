/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.countReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.myUid == null ) {
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
	
	var query = "EXEC [dbo].[UP_INVITATIONS_COUNT_GET] @myUid=" + uid;
	
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
		console.log( record );
		output.result = {};
		output.result.count = record.invitationCount;		
		cb( null );        
	});	
			
}
 