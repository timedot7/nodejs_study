/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.giftReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.uid == null ) {
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
	
	var query = "EXEC [dbo].[UP_PRESENTS_GET] @myUid=" + uid;
	
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
			output.result[i].giftId			= record.pid;
			output.result[i].cn				= record.cn;
			output.result[i].charType		= record.charType;
			output.result[i].giftKind		= record.presentType;
			output.result[i].giftDetail		= record.presentDetail;
			output.result[i].giftCount		= record.presentCount;
			output.result[i].regDate 		= record.regDate;
			output.result[i].daysAgo		= record.daysAgo;
			output.result[i].msg			= record.comment;
		}
		
		cb( null );        
	});	
			
}
 