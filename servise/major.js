const {querySql} = require('../db/index');

//查看所有专业
function selectMajor() {
  return querySql(`select * from major;`);
}

module.exports = {
  selectMajor
}