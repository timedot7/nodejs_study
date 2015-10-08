/**
 * New node file
 */
 
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.noticeReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
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

	var query = "EXEC [dbo].[UP_PLATFORM_NOTICE_GET]" ;
	
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
			output.result[i].pf		= record.pf;
			output.result[i].notice	= record.notice;
		}
		cb( null );
	});
}