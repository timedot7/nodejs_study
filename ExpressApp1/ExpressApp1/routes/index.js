/**
 * New node file
 */

var method = 'POST';

exports = module.exports = function (req, res, next) {
    var output = {
        success : true,
        code : 0
    };
    res.connection.setNoDelay(true);
    helper.sendResponse(req, res, output);
     
}

module.exports.method = method;