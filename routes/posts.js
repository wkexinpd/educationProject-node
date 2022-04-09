var express = require('express');
const Result = require('../models/Result');
const { selectUserDetail } = require('../servise/user');
const { insertPost, increaseReplyNumberById, decreaseReplyNumberById, increaseNiceNumberById, decreaseNiceNumberById, updatePostById, deleteById, selectPosts, selectById, totalPosts } = require('../servise/posts');
const boom = require('boom');
const { dateFormat } = require('../utils/index');

var router = express.Router();

router.post('/addPost', function(req, res, next) {
  let {title, content, creatorId} = req.body;
  let date = new Date();
  let _date = dateFormat('yyyy-MM-dd hh:mm:ss', date);
  let created_at = _date;
  let updated_at = _date;
  let reply_number = 0;
  let nice_number = 0;
  insertPost(title, content, updated_at, created_at, reply_number, nice_number, creatorId).then(result => {
    new Result({}, '添加成功').success(res);
  })
});

router.delete('/delectPost', function(req, res, next) {
  let { id, userId } = req.query;
  selectById(id).then(post => {
    if(post.length === 0) {
      new Result('要删除的帖子不存在').fail(res);
      next(boom.badRequest('要删除的帖子不存在'));
    } else if(post[0] && post[0].creator_id != userId) {
      new Result('只能删除自己的帖子').fail(res);
      next(boom.badRequest('只能删除自己的帖子'));
    }else {
      deleteById(id).then(() => {
        new Result({}, '删除成功').success(res);
      })
    }
  })
});

router.get('/selectPosts', function(req, res, next) {
  let { key = '', from = 1, limit = 8 } = req.query;
  let pageNum = Number(from);
  let pageSize = Number(limit);
  let startNum = (pageNum-1)*pageSize;
  selectPosts(key, startNum, pageSize).then(async posts => {
    let _posts = await Promise.all(
      posts.map(item => {
        return (async () => {
          let user = await selectUserDetail(item.role, item.user_id);
          let _user = user[0];
          return {...item, created_at: dateFormat('yyyy-MM-dd hh:mm:ss', item.created_at), updated_at: ('yyyy-MM-dd hh:mm:ss', item.updated_at), ..._user};
        })();
      })
    );
    totalPosts(key).then(total => {
      new Result({records: _posts, total: total[0].total}, '成功').success(res);
    })
  })
});

router.get('/selectPostById', function(req, res, next) {
  let { postId } = req.query;
  selectById(postId).then(post => {
    let _post = post[0];
    selectUserDetail(_post.role, _post.user_id).then(user => {
      let _user = user[0];
      new Result({post: {..._post, created_at: dateFormat('yyyy-MM-dd hh:mm:ss', _post.created_at), updated_at: ('yyyy-MM-dd hh:mm:ss', _post.updated_at), ..._user}}, '成功').success(res);
    });
  });
})

router.post('/updatePost', function(req, res, next) {
  //必传：id, userId
  //可传：
  let { id, userId } = req.body;
  selectById(id).then(post => {
    if(post.length === 0) {
      new Result('要更新的帖子不存在').fail(res);
      next(boom.badRequest('要更新的帖子不存在'));
    }
    if(post[0].creator_id != userId) {
      new Result('只能更新自己的帖子').fail(res);
      next(boom.badRequest('只能更新自己的帖子'));
    }
    let date = new Date();
    let _date = dateFormat('yyyy-MM-dd hh:mm:ss', date);

    if(req.body.title && req.body.content) {
      updatePostById(id, req.body.title, req.body.content, _date).then(() => {
        new Result({}, '更新成功').success(res);
      });
    }
    // 更新回复人数
    // if(req.body.reply_number) {
    //   if(req.body.reply_increase === 1) {
    //     increaseReplyNumberById(id).then(() => {
    //       new Result({}, '更新成功').success(res);
    //     });
    //   } else if(req.body.reply_decrease === 1) {
    //     decreaseReplyNumberById(id).then(() => {
    //       new Result({}, '更新成功').success(res);
    //     });
    //   }
    // }
    // 更新点赞人数
    // if(req.body.nice_number) {
    //   if(req.body.nice_increase === 1) {
    //     increaseNiceNumberById(id).then(() => {
    //       new Result({}, '更新成功').success(res);
    //     });
    //   } else if(req.body.nice_decrease === 1) {
    //     decreaseNiceNumberById(id).then(() => {
    //       new Result({}, '更新成功').success(res);
    //     });
    //   }
    // }
  })
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
