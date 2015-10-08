/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var output = {
        test : "테스트중",
        success : true,
        code : 0
    };
    res.connection.setNoDelay(true);
    helper.sendResponse(req, res, output);
     
}

module.exports.method = method;