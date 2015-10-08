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
	
	if ( param.myUid == null || param.marketName == null ) {
		output.success = false;
		output.code = ErrorCode.PARAM_INVALID;
		helper.sendResponse(req, res, output);
		return;
	}

	async.waterfall([
        function( cb ) {
            purchaseCountDB(param, output, cb);
        },
		function( purchasedCount, cb ) {
            db(purchasedCount, param, output, cb);
        }        
    ], function (err, result) {
		if ( err ) {			
			logger.warn(err);	
		}
	
		helper.sendResponse(req, res, output);
    });   
}

module.exports.method = method;

function purchaseCountDB(param, output, cb) {
	var myUid = new BigNumber( param.myUid );
	var query = "EXEC [dbo].[UP_SHOP_MARKET_PURCHASED_COUNT_GET] @uid = " + myUid;
	
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
		cb( null, record.purchasedCount );
	});	
}

function db(purchasedCount, param, output, cb) {
	var myUid = new BigNumber( param.myUid );
	var query = "EXEC [dbo].[UP_SHOP_MARKET_ITEMS_GET] @myUid = " + myUid + ", @marketName= '" + param.marketName + "'";
	
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
			output.result[i].marketID		= record.marketID;
			output.result[i].marketName 	= record.marketName;
			output.result[i].itemID	 		= record.itemID;
			output.result[i].itemName 		= record.itemName;
			output.result[i].goodsType 		= record.goodsType;
			output.result[i].goodsQnt	 		= record.goodsQuantity;
			output.result[i].goodsPrice 		= record.goodsPrice;
			output.result[i].dcType			= record.dcType;
			output.result[i].dcValue			= record.dcValue;
			output.result[i].dcFlag				= record.dcFlag;
			output.result[i].dcPlusType		= record.dcPlusType;
			output.result[i].dcComment		= record.dcComment;
			
			if (0 != purchasedCount && record.dcComment == 'FirstPurchase')
			{
				output.result[i].dcFlag	= 0;
			}
		}
		
		cb( null );        
	});	
			
}
 