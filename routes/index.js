var express = require('express');
const boom = require('boom');
var userRouter = require('./users');
var lectureRouter = require('./lecture');
var majorRouter = require('./major');
var companyRouter = require('./company');
var postRouter = require('./posts');
var postCommentRouter = require('./post-comment');
const {CODE_ERROR} = require('../utils/constant');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', userRouter);
router.use('/lecture', lectureRouter);
router.use('/major', majorRouter);
router.use('/company', companyRouter);
router.use('/posts', postRouter);
router.use('/comment',postCommentRouter);

router.use((req, res, next) => {
  next(boom.notFound('借口不存在'));
});

router.use((err, req, res, next) => {
  const msg = (err && err.message) || '系统错误';
  const statusCode = (err.output && err.output.statusCode) || 500;
  const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message;
  res.status(statusCode).json({
    code: CODE_ERROR,
    msg,
    error: statusCode,
    errorMsg
  })
});

module.exports = router;
