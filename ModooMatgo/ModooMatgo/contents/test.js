/**
 * New node file
 */

 // TODO : setInviteCnt 관련 코드 포팅 필요

/*
	req:
		{"invitationReq":{"accountSeq":1,"token":1000078,"targetUserId":"jyjin818test1"}}
	
	res:
		{"token": 1000078,"success": true," invateCnt": 0, "missions":[2,5]}
*/


var method = 'POST';

var options = {
	"Mission" : true,
	"Token" : true,
	"Deprecated" : false
};


var produces = [
	"application/crypto+json",
	"application/crypto+json+v2"
];
 

exports = module.exports = function (req, res, next) {

	console.log( req.body );
/*	
    var param = req.body.testreq;
    
	if ( !preprocess(req, res, param, options, produces) )
    	return; 
    	
	var output = { 
		token : param.token,
		success : true
	};
    
	async.waterfall([
        function (cb) {
            friendInvite(param, output, cb);
        }
    ], function (err, result) {
	
		if ( err ) {			
			logger.warn(err);
		}
		
        makeResponse(req, res, output);
    });
    */
}

module.exports.method = method;

/*
function friendInvite(param, output, cb) {

	var query = "EXEC [CR_GAME].[dbo].[UP_FRIEND_INVITE]";
	query += " @I_ACCOUNT_SEQ=" + param.accountSeq;
	query += ",@I_CHANNEL_CD= '003'";
	query += ",@I_CHANNEL_USER_ID='" +  param.targetUserId + "'"; 
			
	dto.getRecord(query, 0, function(status, result) {
		if ( false == status.success ) {
			output.success = false;
			output.code = ErrorCode.SYSTEM_FAIL;
			cb("db return false");
			return;
		}

		if ( null == result ) {
			output.success = false;
			output.code = ErrorCode.SYSTEM_FAIL;
	  		cb("db result null");        
			return;
		}
		
		var err = null;
		var record = eval(result[0]);
		var resultCode = record.resultCode;

		switch (record.resultCode) {
			case 0:
				output.success = true;
				output.invateCnt = record.FRIEND_INVITE_CNT;
				break;
			case 1: // 이미 초대한친구
				output.success = false;
				output.errorCode = ErrorCode.FRIEND_ALREADY_INVATED;				
				err = "proc result: " + resultCode + " ,query : " + query, output;
				break;
			default:
				output.success = false;
				output.errorCode = ErrorCode.SYSTEM_FAIL;			
				err = "proc result: " + resultCode + " ,query : " + query, output;
				break;
		}
	
        cb(err);        
	});	
}
*/