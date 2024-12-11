const Bookmark = require('../models/Bookmark');

/**
 * 
 * @param {ObjectId} userId 
 * @param {ObjectId} jobId 
 * @returns {Boolean} true: 추가 false: 제거
 */
exports.toggleBookmark = async (userId, jobId) => {
  const existingBookmark = await Bookmark.findOne({ user_id: userId, job_id: jobId });

  if (existingBookmark) {
    // 북마크 제거
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    return { added: false };
  } else {
    // 북마크 추가
    await Bookmark.create({ user_id: userId, job_id: jobId });
    return { added: true };
  }
};

/**
 * 
 * @param {ObjectId} userId 
 * @param {Number} page 
 * @param {Number} limit 
 * @returns {Object}
 */
exports.getBookmarks = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const bookmarks = await Bookmark.find({ user_id: userId })
    .sort({ created_at: -1 }) // 최신순 정렬
    .skip(skip)
    .limit(parseInt(limit))
    .populate('job_id'); // Job 모델 정보 포함

  const total = await Bookmark.countDocuments({ user_id: userId });

  return {
    data: bookmarks,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};
