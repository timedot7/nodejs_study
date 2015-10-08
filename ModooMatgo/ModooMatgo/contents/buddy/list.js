/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.buddyListReq;
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.myUid == null || param.cnList == null ) {
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
	
	var query = "EXEC [dbo].[UP_BUDDY_GET_BY_CN] @myUid=" + myUid + ", @cnList= '" + param.cnList + "'";
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null );
			return;
		}

		output.result = [];
		
		for( var i = 0; i < rows.length; i++ ) {
			var record = eval(rows[i]);
			output.result[i] = {};
			output.result[i].uid				= record.uid;
			output.result[i].cn				= record.cn;
			output.result[i].gameMoney		= record.gameMoney;
			output.result[i].charType		= record.characterIndex;
			output.result[i].allowGift		= record.allowState;
			output.result[i].invitationOpt = record.invitationOpt;
			output.result[i].FertilizerSentDate	= record.lastFertilizerSentDate;
			output.result[i].FertilizerPesterDate	= record.lastFertilizerPesterDate;
			} 
		
		cb(null);
	});
}