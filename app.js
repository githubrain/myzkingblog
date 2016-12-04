var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require("./db");
// 加载路由文件   routes 文件夹专门存放路由文件
var index = require('./routes/index');
var users = require('./routes/users');
var article = require('./routes/article');

var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var app = express();

//加载模板
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置ejs的模板是html
//app.set('view engine', 'html');
//app.engine('html',require('ejs').__express);

app.use(cookieParser());
app.use(session({
  secret: settings.cookieSecret,//secret 用来防止篡改 cookie
  key: settings.db,//key 的值为 cookie 的名字
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天
  resave: true,
  saveUninitialized:true,
  store:new MongoStore({url:settings.url})
}));

app.use(flash());

app.use(function (req,res,next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.keyword = req.session.keyword;
  next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//  设置表单格式  需要两种格式  json 和 urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 加载静态页面

app.use(express.static(path.join(__dirname, 'public')));

//  设置路由处理模块  所有访问"/" 网站根目录的请求都由index路由模块处理
app.use('/', index);
//  所有与用户user相关的访问请求都访问‘/users’这个路径，并且交给users路由模块处理
app.use('/users', users);

// 所有的路由处理全部模块化  所有访问相同资源的请求都有同一个路由模块处理
//  RESTful的设计原则
// 负责处理文章的路由
app.use('/article',article);


// catch 404 and forward to error handler
//  捕捉错误路由  生成错误对象
app.use(function(req, res, next) {
  res.render("404");
});

module.exports = app;
