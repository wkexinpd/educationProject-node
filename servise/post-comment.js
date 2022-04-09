const {querySql} = require('../db/index');

//新增评论
function addPostComment(commentContent, postId, createdAt, niceNumber, creatorId) {
  return querySql(`insert into post_comments (content, post_id, created_at, nice_number, creator_id)
  values ('${commentContent}', '${postId}', '${createdAt}', ${niceNumber}, ${creatorId})`);
}

//查看所有
function selectPostComments(postId) {
  return querySql(`select a.*, b.role, b.user_id from post_comments as a left join users as b on a.creator_id=b.id where post_id = ${postId};`);
}

function selectPostCommentById(commentId) {
  return querySql(`select * from post_comments where id = ${commentId};`);
}

function delectPostComment(commentId) {
  return querySql(`delete from post_comments where id = ${commentId}`);
}

function increaseSubReplyNumberByCommentId(commentId) {
  return querySql(`update post_comments set reply_post_number = reply_post_number + 1 where id = ${commentId}`);
}

function decreaseSubReplyNumberByCommentId(commentId) {
  return querySql(`update post_comments set reply_post_number = reply_post_number - 1 where id = ${commentId}`);
}

function increaseSubNiceNumberByCommentId(commentId) {
  return querySql(`update post_comments set nice_number = nice_number + 1 where id = ${commentId}`);
}

function decreaseSubNiceNumberByCommentId(commentId) {
  return querySql(`update post_comments set nice_number = nice_number - 1 where id = ${commentId}`);
}

function addSubPostComment(subCommentContent, postCommentId, replyUserId, replyUserName, createdAt, creatorId) {
  return querySql(`insert into sub_post_comments (content, post_comment_id, reply_user_id,reply_user_name, created_at, creator_id)
  values ('${subCommentContent}', '${postCommentId}', '${replyUserId}', '${replyUserName}', '${createdAt}', ${creatorId})`);
}

function selectSubPostComments(commentId) {
  return querySql(`select a.*, b.role, b.user_id from sub_post_comments as a left join users as b on a.creator_id=b.id where post_comment_id = ${commentId};`);
}

function selectSubPostCommentById(commentId) {
  return querySql(`select * from sub_post_comments where id = ${commentId};`);
}

function delectSubPostComment(subCommentId) {
  return querySql(`delete from sub_post_comments where id = ${subCommentId}`);
}

module.exports = {
  selectPostCommentById,
  selectSubPostCommentById,
  addPostComment,
  selectPostComments,
  delectPostComment,
  addSubPostComment,
  selectSubPostComments,
  delectSubPostComment,
  increaseSubReplyNumberByCommentId,
  decreaseSubReplyNumberByCommentId,
  increaseSubNiceNumberByCommentId,
  decreaseSubNiceNumberByCommentId
}
