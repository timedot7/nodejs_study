var connect = require('connect');

connect.createServer(connect.router(function (app) {
    app.all('/Home/Index',function(request,response,next) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('<h1>Index Page</h1>');
    response.end();
});
    app.all('/Home/About', function (request, response, next) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write('<h1>About Page</h1>');
        response.end();
    });

})).listen(52273,function() {
    console.log('Server Running at 127.0.0.1:52273');
});
