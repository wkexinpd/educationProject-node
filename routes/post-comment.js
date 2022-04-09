var express = require("express");
const Result = require("../models/Result");
const {
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
  decreaseSubNiceNumberByCommentId,
} = require("../servise/post-comment");
const {
  increaseReplyNumberById,
  decreaseReplyNumberById,
} = require("../servise/posts");
const { selectUserDetail, selectUserById } = require("../servise/user");
const boom = require("boom");
const { dateFormat } = require("../utils/index");

var router = express.Router();

router.post("/addPostComment", function (req, res, next) {
  let { commentContent = "", postId, niceNumber = 0, creatorId } = req.body;
  let date = new Date();
  let createdAt = dateFormat("yyyy-MM-dd hh:mm:ss", date);
  addPostComment(commentContent, postId, createdAt, niceNumber, creatorId).then(
    () => {
      increaseReplyNumberById(postId).then(() => {
        new Result({}, "添加成功").success(res);
      });
    }
  );
});

router.get("/getPostComments", function (req, res, next) {
  let { postId } = req.query;
  selectPostComments(postId).then(async (postComments) => {
    let _posts = await Promise.all(
      postComments.map((item) => {
        return (async () => {
          let user = await selectUserDetail(item.role, item.user_id);
          let _user = user[0];
          return {
            ...item,
            created_at: dateFormat("yyyy-MM-dd hh:mm:ss", item.created_at),
            ..._user,
          };
        })();
      })
    );
    new Result({ records: _posts }, "成功").success(res);
  });
});

router.delete("/delectPostComment", function (req, res, next) {
  let { commentId, postId, userId } = req.query;
  selectPostCommentById(commentId).then(comment => {
    if(comment.length === 0) {
      new Result('要删除的评论不存在').fail(res);
      next(boom.badRequest('要删除的评论不存在'));
    } else if(comment[0] && comment[0].creator_id != userId) {
      new Result('只能删除自己的评论').fail(res);
      next(boom.badRequest('只能删除自己的评论'));
    }else {
      delectPostComment(commentId).then(() => {
        decreaseReplyNumberById(postId).then(() => {
          new Result({}, "删除成功").success(res);
        });
      });
    }
  })
});

// sub-comment
router.post("/addSubPostComment", function (req, res, next) {
  let {
    subCommentContent = "",
    postCommentId,
    replyUserId,
    creatorId,
  } = req.body;
  let date = new Date();
  let createdAt = dateFormat("yyyy-MM-dd hh:mm:ss", date);
  selectUserById(replyUserId).then((user) => {
    let _user = user[0];
    let replyUserName = _user.username;
    addSubPostComment(
      subCommentContent,
      postCommentId,
      replyUserId,
      replyUserName,
      createdAt,
      creatorId
    ).then(() => {
      increaseSubReplyNumberByCommentId(postCommentId).then(() => {
        new Result({}, "添加成功").success(res);
      })
    });
  });
});

router.delete("/delectSubComment", function (req, res, next) {
  let { commentId, postId, userId } = req.query;
  selectSubPostCommentById(commentId).then(comment => {
    if(comment.length === 0) {
      new Result('要删除的评论不存在').fail(res);
      next(boom.badRequest('要删除的评论不存在'));
    } else if(comment[0] && comment[0].creator_id != userId) {
      new Result('只能删除自己的评论').fail(res);
      next(boom.badRequest('只能删除自己的评论'));
    }else {
      delectSubPostComment(commentId).then(() => {
        decreaseReplyNumberById(postId).then(() => {
          new Result({}, "删除成功").success(res);
        });
      });
    }
  })
})

router.get('/getSubPostComments', function(req, res, next) {
  let { commentId } = req.query;
  selectSubPostComments(commentId).then(async comments => {
    let _comments = await Promise.all(
      comments.map((item) => {
        return (async () => {
          let user = await selectUserDetail(item.role, item.user_id);
          let _user = user[0];
          return {
            ...item,
            created_at: dateFormat("yyyy-MM-dd hh:mm:ss", item.created_at),
            ..._user,
          };
        })();
      })
    );
    new Result({ records: _comments }, "成功").success(res);
  })
})

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
