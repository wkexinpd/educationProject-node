var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lectureRouter = require('./routes/lecture');
var majorRouter = require('./routes/major');
var companyRouter = require('./routes/company');
var postRouter = require('./routes/posts');
var postCommentRouter = require('./routes/post-comment');

var app = express();
var http = require('http');
const bodyParser = require('body-parser');
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lecture', lectureRouter);
app.use('/major', majorRouter);
app.use('/company', companyRouter);
app.use('/posts', postRouter);
app.use('/comment', postCommentRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

server.listen('3000');
