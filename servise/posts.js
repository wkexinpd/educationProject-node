const {querySql} = require('../db/index');

function insertPost(title='', content='', updatedAt='', createdAt='', reply_number = 0, nice_number = 0, creatorId) {
  return querySql(`insert into posts (title, content, updated_at, created_at, reply_number, nice_number, creator_id)
  values ('${title}', '${content}', '${updatedAt}', '${createdAt}', ${reply_number}, ${nice_number}, ${creatorId})`);
}

function increaseReplyNumberById(id) {
  return querySql(`update posts set reply_number = reply_number + 1 where id = ${id}`);
}

function decreaseReplyNumberById(id) {
  return querySql(`update posts set reply_number = reply_number - 1 where id = ${id}`);
}

function increaseNiceNumberById(id) {
  return querySql(`update posts set nice_number = nice_number + 1 where id = ${id}`);
}

function decreaseNiceNumberById(id) {
  return querySql(`update posts set nice_number = nice_number - 1 where id = ${id}`);
}

function updatePostById(id, title, content, updated_at) {
  return querySql(`update posts set title = '${title}', content = '${content}', updated_at = '${updated_at}'  where id = ${id};`);
}

function deleteById(id) {
  return querySql(`delete from posts where id = ${id}`);
}

function selectPosts(key = '', from = 0, limit = 8) {
  return querySql(`select a.*, b.role, b.user_id from posts as a left join users as b on a.creator_id=b.id where a.title like '%${key}%' or a.content like '%${key}%' ORDER BY a.id limit ${from},${limit};`);
}

function totalPosts(key = '') {
  return querySql(`select count(id) as total from posts WHERE title like '%${key}%' or content like '%${key}%';`);
}

function selectById(id) {
  return querySql(`select a.*, b.role, b.user_id from posts as a left join users as b on a.creator_id=b.id where a.id = ${id};`);
}

module.exports = {
  insertPost,
  increaseReplyNumberById,
  decreaseReplyNumberById,
  increaseNiceNumberById,
  decreaseNiceNumberById,
  updatePostById,
  deleteById,
  selectPosts,
  totalPosts,
  selectById
}