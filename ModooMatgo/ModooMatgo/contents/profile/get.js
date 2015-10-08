/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.profileReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.myUid == null || param.oppUid == null ) {
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
	var oppUid = new BigNumber( param.oppUid );
	
	var query = "EXEC [dbo].[UP_PROFILE_GET] @myUid=" + myUid + ", @oppUid=" + oppUid;
	
	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;
			output.code = result.code;
			cb( null, output );
			return;
		}
		
		if( rows == null || rows.length != 1 ) {
			output.success = false;
			output.code = ErrorCode.DB_NO_RESULTS;
	 		cb( null, output );        
			return;				
		}
				
		var record = eval(rows[0]);
//		console.log( record );
		output.result = {};
//		output.result.charType				= record.curCharType;
//		output.result.winCount				= record.totalWin;
//		output.result.loseCount				= record.totalLose;
//		output.result.topScore					= record.topScore;
//		output.result.cumScore				= record.cumScore;
//		output.result.weeklyTopScore		= record.weeklyTopScore;
//		output.result.weeklyScore			= record.weeklyScore;
//		output.result.totalGoldMedals		= record.totalGoldMedals;
//		output.result.totalSilverMedals		= record.totalSilverMedals;
//		output.result.totalBronzeMedals	= record.totalBronzeMedals;
//		output.result.totalGoldBadges		= record.totalGoldBadges;
//		output.result.totalSilverBadges	= record.totalSilverBadges;
//		output.result.totalBronzeBadges	= record.totalBronzeBadges;
//		output.result.topScoreDate			= record.topScoreDate;
//		output.result.cumScoreDate		= record.cumScoreDate;
		output.result.winCountVsOpp		= record.winCountVsOpp;
		output.result.loseCountVsOpp		= record.loseCountVsOpp;
		output.result.topScore 		= record.topScore;
		cb( null );        
	});	
			
}
 