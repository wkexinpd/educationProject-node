const {querySql} = require('../db/index');

// 查询所有课程
// 多表查询 lecture、video、lecture_chapter

// 通过专业查询
function selectLectureByMajor(major = '', from = 0, limit = 8) {
  return querySql(`select a.* from lectures as a,major as b where a.major_id=b.major_id and b.major_id=${major} limit ${from},${limit};`);
}

// 通过关键字查找
function selectLecture(key = '', from = 0, limit = 8) {
  return querySql(`SELECT * from lectures WHERE title like '%${key}%' or content like '%${key}%' or speaker like '%${key}%' limit ${from},${limit};`);
}

// 查询total
function totalLecture(key = '') {
  return querySql(`select count(lecture_id) as total from lectures  WHERE title like '%${key}%' or content like '%${key}%' or speaker like '%${key}%';`);
}

function totalMajorLecture(major = '') {
  return querySql(`select COUNT(*) as total from lectures as a,major as b where a.major_id=b.major_id and b.major_id=${major};`);
}

// 查看课程详情
function selectLectureDetail(lectureId = '') {
  return querySql(`SELECT * from lectures where lecture_id=${lectureId};`);
}

// 查看章节详情
function selectLectureChapterDetail(lectureId = '') {
  return querySql(`select b.*,c.* from lectures as a,lecture_chapter as b,videos as c where b.lecture_id=a.lecture_id and b.video_id=c.videos_id and a.lecture_id=${lectureId};`);
}

module.exports = {
  selectLectureByMajor,
  selectLecture,
  selectLectureDetail,
  selectLectureChapterDetail,
  totalLecture,
  totalMajorLecture
}