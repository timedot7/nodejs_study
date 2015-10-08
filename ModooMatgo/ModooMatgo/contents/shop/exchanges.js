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
	
	if ( param.myUid == null ) {
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

	var query = "EXEC [dbo].[UP_SHOP_EXCHANGES_GET] @myUid=" + myUid;
	
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
			output.result[i].exchangeID		= record.exchangeID;
			output.result[i].sourceType 		= record.sourceType;
			output.result[i].sourceCount 	= record.sourceCount;
			output.result[i].targetType 		= record.targetType;
			output.result[i].targetCount		= record.targetCount;
			output.result[i].dcType 			= record.dcType;
			output.result[i].dcValue 			= record.dcValue;
			output.result[i].dcFlag 			= record.dcFlag;
			output.result[i].dcPlusType		= record.dcPlusType;
			output.result[i].dcComment		= record.dcComment;
		}
		
		cb( null );        
	});	
			
}
 