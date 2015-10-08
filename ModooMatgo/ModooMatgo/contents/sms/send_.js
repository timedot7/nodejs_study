/**
 * New node file
 */
var du = require('date-utils');

var method = 'POST';

var dt, tempTime, sendTime;

exports = module.exports = function (req, res, next) {
    var param = req.body.smssendReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.uid == null || param.calleenumber == null || param.callbacknumber == null || param.msg == null ) {
		output.success = false;
		output.code = ErrorCode.PARAM_INVALID;
		helper.sendResponse(req, res, output);
		return;
	}
	
	dt = new Date();	
	tempTime = dt.toFormat('YYYYMMDDHH24MISSMSLL');
	sendTime = tempTime.substring(2, tempTime.length-2);
	dt = null;
	
	async.waterfall([
        function( cb ) {
            db(param, output, cb);
        },
        function(output, cb) {
        	db2(param, output, cb);
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
	var query = "EXEC [dbo].[spInsertSMS] " 
				+ "@calleeNo=" + '\'' + param.calleenumber + '\'' 
				+ ",@callbackNo=" + '\'' + param.callbacknumber + '\''
				+ ",@smsMsg=" + '\'' + param.msg + '\''
				+ ",@sendTime=" +  '\'' + sendTime + '\'';
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb(null, output);
			return;
		}
		cb(null, output);				
	});
}

function db2(param, output, cb) {
	if ( output.success == false ) {
		cb( null );
		return;
	};
	
	var count = 0;
	var checkID = setInterval( function() {
		var checkQuery = 'EXEC [dbo].[spCheckSMSResult] ' + '@sendTime=' + '\'' + sendTime + '\'';
		output.result = {};
		mssql.query( checkQuery, function(result, rows) {
			if( result.success == false ) {
				clearInterval(checkID);
				output.success = false;
				output.code = result.code;
				return;
			}
			
			if( rows == null || rows.length != 1 ) {
				clearInterval(checkID);
				output.success = false;
				output.code = ErrorCode.DB_NO_RESULTS;
				//console.log( output );
				cb( null );
				return;
			}			
			
			var record = eval(rows[0]);
			output.result.sendStatus = record.PROC_STS;
			output.result.sendResult = record.PROC_RESULT;

			// 전송중 상태에서 전송결과 갱신 및 필드 삭제가 빨리 일어나서 레코드를 받아오지 못하는 상태 발생.. 일단 전송 중 상태(1)도 완료처리 한다......
			// 헬로비전과 논의해서.. 삭제되는 타이밍을 조절해야 할 듯....
			if ( record.PROC_RESULT == 0 && ( record.PROC_STS == 0 || record.PROC_STS == 1 || record.PROC_STS == 2 ) ) {
				clearInterval(checkID);
				cb(null);				
				return;
			}
			else if ( record.PROC_RESULT == 7 )
			{
				clearInterval(checkID);
				cb(null);				
				return;
			}
			
			count++;
			if ( count == 3 ) {
				clearInterval(checkID);
				cb(null);
				return;
			}
		});								
	}, 1000 );
}
