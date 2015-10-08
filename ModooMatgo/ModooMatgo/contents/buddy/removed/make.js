/**
 * New node file
 */
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.makeReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.uid == null || param.phonelist == undefined ) {
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

	var phone_nums = "";
	for ( var i = 0; i< param.phonelist.length; i++) {

		// 전화번호체크
		for ( var j = 0; j < param.phonelist[i].length; j++ ) {
			var ch = param.phonelist[i].charCodeAt(j);
			// 번호 0 ~ 9까지만 허용
			if ( ch < 48 || ch > 57 ) {
				logger.warn( "err_phone: " + param.phonelist[i]);
				output.success = false;
				output.code = ErrorCode.PARAM_INVALID;
				cb( null, output );
				return;
			}
		}

		// 체크된 전화번호를 문자열 형태로 변환한다
		if ( i < param.phonelist.length-1 ) {
			phone_nums = phone_nums + param.phonelist[i] + ",";
		}
		else {
			phone_nums = phone_nums + param.phonelist[i];
		}
	}

//	logger.warn( "phone list: " +  phone_nums );

	var query = "EXEC [dbo].[spMakeBuddiesInList] @myUid=" + uid + ",@phoneList=" + '\'' + param.phonelist + '\'';
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
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
			output.result[i].buddyState = record.buddyState;
		}
		
		cb( null );        
	});	
			
}