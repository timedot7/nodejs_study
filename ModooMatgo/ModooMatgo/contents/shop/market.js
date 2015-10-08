/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.marketReq;
    
	var output = { 
		success : true,
		code : 0
	};
	
	if ( param.marketName == null ) {
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

	var query = "EXEC [dbo].[UP_MARKET_ITEMS_GET] @marketName= '" + param.marketName + "'";
	
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
			output.result[i].marketID		= record.marketID;
			output.result[i].marketName 	= record.marketName;
			output.result[i].itemID	 		= record.itemID;
			output.result[i].itemName 		= record.itemName;
			output.result[i].goodsType 		= record.goodsType;
			output.result[i].goodsQnt	 		= record.goodsQuantity;
			output.result[i].goodsPrice 		= record.goodsPrice;
		}
		
		cb( null );        
	});	
			
}
 