var fs = require('fs');

require('http').createServer(function (request, response) {
    fs.readFile('test.png', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.end(data);
    });
}).listen(52273, function () { 
    console.log('Server Running at http://127.0.0.1:52273');
});