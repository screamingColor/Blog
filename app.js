var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var mongoStore = require('connect-mongo')(session);
var multipart = require('connect-multiparty');
var flash = require('connect-flash')

var fs = require('fs')

var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://127.0.0.1:27017/test");
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());
app.use(multipart())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('bower_components'));
app.use(session({
    secret:'secret',
    store:new mongoStore({
       url:"mongodb://127.0.0.1:27017/test",
       collection:"sessions"
    }),
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*30  //过期时间设置(单位毫秒)
    }
}));

app.use(function (req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    /*console.log(_user)*/
    next()
})

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
