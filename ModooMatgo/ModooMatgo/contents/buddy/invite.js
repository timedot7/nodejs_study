/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.inviteReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.uid == null || param.targetphone == null ) {
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
	var query = "EXEC [dbo].[UP_INVITATIONS_ADD] @myUid=" + uid + ",@oppKey=" + '\'' + param.targetphone + '\'';

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
		output.result.phone 			= record.oppKey;
		output.result.inviteDate 		= record.lastInviteDate;
		output.result.inviteTime		= record.lastInviteTime;
		output.result.invitationCnt	= record.invitationCount;
		output.result.dailyCnt			= record.dailyCount;
		output.result.newInvited		= record.newInvited;
		cb( null );
	});
}
