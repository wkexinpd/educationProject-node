const {querySql} = require('../db/index');

//查看所有企业
function selectCompany() {
  return querySql(`select * from company;`);
}

function selectCompanyDetail(id) {
  return querySql(`select * from company WHERE company_id=${id};`);
}

module.exports = {
  selectCompany,
  selectCompanyDetail
}