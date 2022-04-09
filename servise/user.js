const {querySql} = require('../db/index');

function login(username, password) {
  return querySql(`select * from users where username='${username}' and password='${password}'`);
}

function selectUserDetail(role, user_id) {
  if(role === 'teacher') {
    return querySql(`select * from teacher_profiles where user_id = ${user_id};`);
  } else if (role === 'staff') {
    return querySql(`select * from staff_profiles where user_id = ${user_id};`);
  } else if (role === 'student') {
    return querySql(`select * from student_profiles where user_id = ${user_id};`);
  }
}

function selectUserById(user_id) {
  return querySql(`select * from users where id = ${user_id};`);
}

module.exports = {
  login,
  selectUserDetail,
  selectUserById
}