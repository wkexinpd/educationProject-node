var express = require('express');
const Result = require('../models/Result');
const { selectMajor } = require('../servise/major');
const boom = require('boom');

var router = express.Router();

router.get('/selectMajor', function(req, res, next) {
  selectMajor().then(major => {
    new Result({major: major},'成功').success(res);
  })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
