/**
 * New node file
 */
var method = 'POST';

exports = module.exports = function (req, res, next) {
    var param = req.body.registerpushinfoReq;
    
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
	query.msgid = 'NSP2::MS::RegisterPushInfo_Req';
	query.query = {};
	query.query.pushInfo = {};
	query.query.mobileDeviceInfo = {};
	
	query.query.pushInfo.serviceCode = param.servicecode;
	query.query.pushInfo.CN = param.cn; // null 가능
	query.query.pushInfo.userKey = param.userkey; // null 가능
	query.query.pushInfo.version = param.version;	
	query.query.pushInfo.pushServiceType = param.pushservicetype; // 0:android 1:ios
	query.query.pushInfo.pushRegistrationID = param.pushregistrationid;
	query.query.pushInfo.pushAllowFlag = param.pushallowflag; 
	
	query.query.mobileDeviceInfo.deviceKey = param.devicekey;
	query.query.mobileDeviceInfo.deviceType = param.devicetype;
	query.query.mobileDeviceInfo.deviceModelName = param.devicemodel;
	query.query.mobileDeviceInfo.deviceFirmwareVersion = param.devicefirmwareversion;
	query.query.mobileDeviceInfo.deviceOSVersion = param.deviceosversion;
	query.query.mobileDeviceInfo.macAddress = param.macaddress;
	query.query.mobileDeviceInfo.simOperatorName = param.simname;
	
	request(baseurl + JSON.stringify(query), function(err, res, body) {
		var result = JSON.parse(body);		
		output.code = body.msginfo.errorCode; 
		if (!err && res.statusCode == 200 ) {
			output.success = true;
			output.result = {};
			output.result.mobileDeviceInfo = result.msginfo.mobileDeviceInfo;
			output.result.pushInfo = result.msginfo.pushInfo;
		}
		else {
			output.success = false;
		}
	});
				
	cb( null );        
}