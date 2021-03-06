/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
	var param = req.body.noticeReq

	var output = { 
		success : true,
		code : 0
	};

	// CN을 입력받는다
	if ( param.myCN == null ) {
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
	
	var query = "EXEC [dbo].[UP_NOTICE_LIST] @myCN = '" + param.myCN + "'";
	
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
			output.result[i].noticeSeq = record.NOTICE_SEQ;
			output.result[i].title = record.TITLE;
			output.result[i].content = record.CONTENT;
			output.result[i].noticeType = record.NOTICE_TYPE_CD;
			output.result[i].noticeBoxType = record.NOTICE_BOX_TYPE_CD;
		}
		
		cb( null );        
	});	
			
}
 