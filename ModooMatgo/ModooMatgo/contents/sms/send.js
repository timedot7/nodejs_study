/**
 * New node file
 */
var du = require('date-utils');

var method = 'POST';

var dt, tempTime, sendTime;

//var msgKey;

exports = module.exports = function (req, res, next) {
    var param = req.body.smssendReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0,
		mkey : 0
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
        	db2(param, output,  cb);
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
	var query = "EXEC [dbo].[spInsertSMS2] " 
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

		// msgKey���� ���;� ������, Ű�� ���� ��� ������ ������ ����̹Ƿ� ����
		if( rows == null || rows.length != 1 ) {
			output.success = false;
			output.code = ErrorCode.DB_NO_RESULTS;
			cb(null, output);
			return;
		}

		var record = eval(rows[0]);
		output.mkey = record.msgKey;

		cb(null, output  );				
	});
}

function db2(param, output,  cb) {
	if ( output.success == false ) {
		cb( null );
		return;
	};

	var count = 0;
	var checkID = setInterval( function() {
		var checkQuery = 'EXEC [dbo].[spCheckSMSResult2] ' + '@msgKey=' + output.mkey;
		output.result = {};
		mssql.query( checkQuery, function(result, rows) {

			// ���������� �߻��� ���
			if( result.success == false ) {
				clearInterval(checkID);
				output.success = false;
				output.code = result.code;
				return;
			}
			
			// ����� ���� ���
			if( rows == null || rows.length != 1 ) {
				clearInterval(checkID);
				output.success = false;
				output.code = ErrorCode.DB_NO_RESULTS;
				//console.log( 'no record...' );
				cb( null );
				return;
			}			
			
			// ���ڵ尪 ����
			var record = eval(rows[0]);
			output.result.sendStatus = record.PROC_STS;
			output.result.sendResult = record.PROC_RESULT;

			// ���ۼ����̳� ���ۿϷ��� ���
			if ( record.PROC_RESULT == 0 && ( record.PROC_STS == 0 || record.PROC_STS == 2 ) ) {
				//console.log( 'ok1...' );
				clearInterval(checkID);
				cb(null);				
				return;
			}
			
			// ������ �Ǿ����� ����̰ų� ��Ÿ����
			if ( record.PROC_RESULT == 7 || record.PROC_RESULT == 999 )
			{
				//console.log( 'fail1...' );
				clearInterval(checkID);
				cb(null);				
				return;
			}
			
			// ���� ���̰ų� ���۴�� ���� ���
			if ( record.PROC_RESULT == 0 && record.PROC_STS == 1 )
			{
				//console.log( 'sending...' + output.mkey );
			}

			if ( record.PROC_RESULT == 0 && record.PROC_STS == -1 )
			{
				//console.log( 'waiting...' + output.mkey );
			}
			
			count++;

			if ( count == 10 ) {
				//console.log( 'timeout...' + output.mkey );
				clearInterval(checkID);
				cb(null);
				return;
			}
		});								
	}, 1000 );
}
