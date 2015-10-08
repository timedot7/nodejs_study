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
	var myUid = new BigNumber( param.myUid );
	
	var query = "EXEC [dbo].[UP_MESSAGE_GET] @myUid=" + myUid;
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
		
		output.result = [];
		
		for( var i = 0; i < rows.length; i++ ) {
			var record = eval(rows[i]);
			output.result[i] = {};
			output.result[i].msgID			= record.msgID;
			output.result[i].sendUid		= record.sendUid;
			output.result[i].type			= record.msgType;
			output.result[i].message		= record.msgString;
			output.result[i].regDate		= record.regDate;
		}
		
		cb( null );        
	});	
			
}
 