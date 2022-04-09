var express = require('express');
const Result = require('../models/Result');
const {login} = require('../servise/user');
const { md5 } = require('../utils');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');
const { body, validationResult } = require('express-validator');
const boom = require('boom');
const jwt = require('jsonwebtoken');

var router = express.Router();

router.post('/login', 
  [
    body('username').isString().withMessage('用户名必须为字符串'),
    body('password').isString().withMessage('密码必须为字符串')
  ]
,function(req, res, next) {
  const err = validationResult(req);
  if(!err.isEmpty()){
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let {username, password} = req.body;
    password = md5(`${password}${PWD_SALT}`);
    login(username, password).then(user => {
      if(!user || user.length === 0) {
        new Result('登录失败').fail(res);
      } else {
        const [{id, role}] = user;
        const token = jwt.sign(
          {username},
          PRIVATE_KEY,
          { expiresIn: JWT_EXPIRED }
        )
        // console.log("token",token);
        new Result({token,username,userId: id,role: role},'登录成功').success(res);
      }
    })
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
