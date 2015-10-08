var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/*
var routes = require('./routes/index');
var users = require('./routes/users');
*/

var app = express();


helper = require('./lib/helper');
ErrorCode = require('./config/errorcode').ErrorCode;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var numCPUs = 1;
//if (process.env.NODE_ENV == 'production') {
    config = require('./config/config_production.js');
    numCPUs = require('os').cpus().length;
//} 
//else {
//   config = require('./config/config_development.js');
//}


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

registRouter(app);
/*
app.use('/', routes);
app.use('/users', users);
*/

// catch 404 and forward to error handler

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function initHttpServer() {
    var http = require('http');
    mssql = require('./Libs/mssqlDB');
    request = require('request');
    var app = express();
    app.use(express.bodyParser());
    
    registRouter(app);
    
    process.on('starthttp', function () {
        var httpserver = http.createServer(app).listen(config.server.port, function () {
            logger.info("HTTP running at http://127.0.0.1:" 
				   	+ config.server.port + " Mode:" + config.server.env);
        });
        
        httpserver.on("connection", function (socket) {
            socket.setNoDelay(true);
        });
		
    });
};

// 李⑥감李⑥뿉??媛?몄샂
function registRouter(app) {
    var path = require('path');
    var walk = require('walk');
    var S = require('string');
    
    var files = [];
    
    var walker = walk.walk(__dirname + config.server.basedir, { followLinks: false });
    
    walker.on('file', function (root, stat, next) {
        var pos = root.indexOf(config.server.basedir);
        var isScript = S(stat.name).right(2).endsWith('js');	// only .js file	
        if (false == isScript) {
            next();
            return;
        }
        
        var rel_path = root.substr(pos + config.server.basedir.length, root.length - pos - config.server.basedir.length) + '/';
        var uri = rel_path + S(stat.name).left(stat.name.length - 3); // .js ?쒓굅
        
        var func = require(root + '/' + stat.name);
        var method = func.method.toLowerCase(), routeFunc = func;
        
        //logger.verbose(func.method + ' URI=' + uri);
        app[method](uri, routeFunc);
        app.use(uri, routeFunc);
        next();
    });
    
    walker.on('end', function () {
        process.emit('starthttp');
    });
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    
    return '0.0.0.0';
}

module.exports = app;
