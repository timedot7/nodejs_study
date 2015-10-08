/**
 * New node file
 */
exports.sendResponse = function (req, res, output) {
    res.writeHead(200, { "Content-Type": "application/json", "charset" : "UTF-8" });
    res.write(JSON.stringify(output));
    res.end();
};

exports.setOutputError = function (output, errormsg, code) {
    output.success = false;
    output.errormsg = errormsg;
    output.code = code;
};