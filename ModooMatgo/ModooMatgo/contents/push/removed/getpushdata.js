/**
 * New node file
 */
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.getpushdataReq;
    
	var output = { 
//		token : param.token,
		success : true,
		code : 0
	};
	
	async.waterfall([
        function( cb ) {
            webcall(param, output, cb);
        }        
    ], function (err, result) {
		if ( err ) {			
			logger.warn(err);	
		}
	
		helper.sendResponse(req, res, output);
    });   
}

module.exports.method = method;

function webcall(param, output, cb) {
	var baseurl = 'http://192.168.62.78:20080/Gateway/NSP2/MS/Server?';
	var query = {};
	query.msgid = 'NSP2::MS::GetPushDataList_Req';
	query.query = {};
	query.query.serviceCode = param.servicecode;
	query.query.deviceKey = param.devicekey;
	query.query.cn = param.cn;
	query.query.userKey = param.userkey;
	
	request(baseurl + JSON.stringify(query), function(err, res, body) {
		var result = JSON.parse(body);		
		output.code = body.msginfo.errorCode; 
		if (!err && res.statusCode == 200 ) {
			output.success = true;
			output.result = {};
			output.result.deviceKey = result.msginfo.deviceKey;
			
			output.pushDataList = {};
			output.pushDataList.datas = result.msginfo.pushDataList.datas;
			output.pushDataList.serviceCode =  result.msginfo.pushDataList.serviceCode;			
		}
		else {
			output.success = false;
		}
	});
				
	cb( null );        
}