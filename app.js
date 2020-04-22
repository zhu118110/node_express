var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
 

var details=require('./routes/details');   //前台点击标题进入的详情页
var comment=require('./routes/comment');   //详情页发表评论
var login=require('./routes/login');  //前台登陆页面
var article=require('./routes/manage/aboutwz/article');  //后台添加文章和查看文章
var reply=require('./routes/manage/aboutwz/reply');  //后台回复的评论
var pandect=require('./routes/manage/pandect/pandect');  //后台-总览

var app = express();
app.use(history());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 自己加的
app.use(express.static(path.join(__dirname,'/public/dist')));
// app.use(express.static('dist'));

var bodyParser = require('body-parser')
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));


app.use('/', details);
app.use('/', comment);
app.use('/', login);
app.use('/', article);
app.use('/', reply);
app.use('/', pandect);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen("3000",function(){
	console.log("127.0.0.1:3000,服务器已经启动")
})
module.exports = app;
