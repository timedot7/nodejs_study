
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.serverReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	if ( param.id == null ) {
		output.success = false;
		output.code = ErrorCode.PARAM_INVALID;
		helper.sendResponse(req, res, output);
		return;
	}
	
	async.waterfall([
        function( cb ) {
            db(param, output, cb);
        },        
        function( output, cb ) {
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
	var query = "EXEC [dbo].[spCheckAbnormalDisconnectedByID] @id=" + '\'' + param.id + '\'' ;
	
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
		
		output.success = true;
		var record = eval(rows[0]);
		
		output.result = {};
		output.result.ip = record.ip;
		output.result.port = record.port;
		output.result.roomIndex = record.roomIdx;
		
  		cb( null, output );        
	});
}

function db2(param, output, cb) {
	if ( output.success == true ) {
		cb( null );
		return;
	};
	
	var query = "EXEC [dbo].[spGetServerStates]";

	mssql.query( query, function(result, rows) {
		if( result.success == false ) {
			output.success = false;	
			output.code = result.code;		
			cb( null );
			return;
		}
		
		if( rows == null || rows.length < 1 ) {
			output.success = false;
			output.code = ErrorCode.DB_NO_RESULTS;
	  		cb( null );        
			return;			
		}
		
		output.success = true;
		var record = eval(rows[0]);
		
		output.result = {};
		output.result.ip = record.ip;
		output.result.port = record.port;
		output.result.roomIndex = -1;
		
  		cb( null );        
	});
}

