/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.listReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
	if ( param.dayOfTheWeek == null ) {
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
	
	var query = "EXEC [dbo].[UP_DAILY_MISSION_SCHEDULE_GET] @dayOfTheWeek=" + param.dayOfTheWeek;
	
	mssql.query2( query, function(result, rows) {
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
			output.result[i].dayOfTheWeek = record.dayOfTheWeek;
			output.result[i].dayOfTheWeekName = record.dayOfTheWeekName;
			output.result[i].missionStep = record.missionStep;
			output.result[i].missionValue = record.missionValue;
			output.result[i].missionType = record.missionType;
			output.result[i].missionDesc = record.missionDesc;
			output.result[i].missionCount = record.missionCount;
			output.result[i].rewardType = record.rewardType;
			output.result[i].rewardCount = record.rewardCount;
		}
		
		cb( null );        
	});	
			
}
 