const {CODE_ERROR, CODE_SUCCESS} = require('../utils/constant');

class Result {
  constructor(result, msg = '操作成功', options) {
    this.result = null
    if (arguments.length === 0) {
      this.msg = '操作成功'
    } else if (arguments.length === 1) {
      this.msg = result
    } else {
      this.result = result
      this.msg = msg
      if (options) {
        this.options = options
      }
    }
  }

  createResult() {
    if (!this.code) {
      this.code = CODE_SUCCESS
    }
    let base = {
      code: this.code,
      msg: this.msg
    }
    if (this.result) {
      base.result = this.result
    }
    if (this.options) {
      base = { ...base, ...this.options }
    }
    console.log(base);
    return base
  }

  json(res) {
    res.json(this.createResult())
  }

  success(res) {
    this.code = CODE_SUCCESS
    this.json(res)
  }

  fail(res) {
    this.code = CODE_ERROR
    this.json(res)
  }
}

module.exports = Result