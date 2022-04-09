var express = require('express');
const Result = require('../models/Result');
const {selectLecture, selectLectureDetail, selectLectureChapterDetail, selectLectureByMajor, totalLecture, totalMajorLecture} = require('../servise/lecture');
const boom = require('boom');

var router = express.Router();

router.get('/selectLecture', function(req, res, next) {
  let { key = '', major = '', from = 1, limit = 8 } = req.query;
  let pageNum = Number(from);
  let pageSize = Number(limit);
  let startNum = (pageNum-1)*pageSize;
  if(!major) {
    selectLecture(key, startNum, pageSize).then(lectures => {
      // console.log("lectures",lectures);
      totalLecture(key).then(total => {
        new Result({records: lectures, pageSize, currentPage: pageNum, total: total[0].total},'成功').success(res);
      })
    })
  } else {
    selectLectureByMajor(major, startNum, pageSize).then(lectures => {
      totalMajorLecture(major).then(total => {
        new Result({records: lectures, pageSize, currentPage: pageNum, total: total[0].total},'成功').success(res);
      })
    })
  }
});

router.get('/selectLectureByMajor', function(req, res, next) {
  let { major = '' } = req.query;
  selectLectureByMajor(major).then(lectures => {
    new Result({records: lectures, total: lectures.length},'成功').success(res);
  })
})

router.get('/selectLectureDetail', function(req, res, next) {
  let { lectureId } = req.query;
  if(!lectureId) {
    next(boom.badRequest('lectureId为空'));
  } else {
    selectLectureDetail(lectureId).then(lecture => {
      selectLectureChapterDetail(lectureId).then(lectureChapter => {
        let _lecture = lecture[0];
        let lectureDetail = {..._lecture, chapter: lectureChapter};
        new Result(lectureDetail,'成功').success(res);
      })
    })
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
