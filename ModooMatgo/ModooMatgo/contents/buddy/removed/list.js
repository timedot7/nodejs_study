/**
 * New node file
 */
/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.buddiesReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.uid == null || param.cn == null || param.myphone == null ) {
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
	
	var query = "EXEC [dbo].[spGetBuddies] @myUid=" + uid + ",@myCN=" + '\'' + param.cn + '\'' + ",@myPhone=" + '\'' + param.myphone + '\'';
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
		
		output.result = [];
		//output.result.buddyUids = [];
		//output.result.buddyNicks = [];
		//output.result.buddyKeys = [];
		//output.result.buddyLevels = [];
		
		for( var i = 0; i < rows.length; i++ ) {
			var record = eval(rows[i]);
			output.result[i] = {};
			output.result[i].uid = record.uid;
			output.result[i].nick = record.nickname;
			output.result[i].cn = record.cn;
			output.result[i].phone = record.phone;
			output.result[i].giftTime = record.lastPresentTimeSeconds;			
		}
		cb( null );        
	});	
}
 