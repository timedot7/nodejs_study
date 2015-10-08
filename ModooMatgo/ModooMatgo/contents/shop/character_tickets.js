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

	var query = "EXEC [dbo].[UP_SHOP_CHARACTER_TICKETS_GET] @myUid=" + myUid;
	
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
			output.result[i].productID		= record.productID;
			output.result[i].ticketType		= record.ticketType;
			output.result[i].charType 		= record.charType;
			output.result[i].ticketValue		= record.ticketValue;
			output.result[i].priceType 		= record.priceType;
			output.result[i].price 				= record.price;
			output.result[i].dcType 			= record.dcType;
			output.result[i].dcValue 			= record.dcValue;
			output.result[i].dcFlag 			= record.dcFlag;
			output.result[i].dcPlusType		= record.dcPlusType;
			output.result[i].dcComment		= record.dcComment;
		}
		
		cb( null );        
	});	
			
}
 