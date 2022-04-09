var express = require('express');
const Result = require('../models/Result');
const { selectCompany, selectCompanyDetail } = require('../servise/company');
const boom = require('boom');

var router = express.Router();

router.get('/selectCompany', function(req, res, next) {
  selectCompany().then(companys => {
    new Result(companys,'成功').success(res);
  });
})

router.get('/selectCompanyDetail', function(req, res, next) {
  let { id = '' } = req.query;
  selectCompanyDetail(id).then(company => {
    let introduce = company[0].introduce;
    let _introduce = introduce && introduce.split('\n');
    let culture = company[0].culture;
    let _culture = culture && culture.split(';');
    let develop_process = company[0].develop_process;
    let _develop_process = develop_process && develop_process.split(';');
    let env_img = company[0].env_img;
    let _env_img = env_img && env_img.split(';');
    let _company = {...(company[0]), introduce: _introduce, culture: _culture, develop_process: _develop_process, env_img: _env_img};
    new Result(_company,'成功').success(res);
  });
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
