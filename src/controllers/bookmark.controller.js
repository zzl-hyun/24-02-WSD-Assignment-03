const bookmarkService = require('../services/bookmark.service');

/**
 * 북마트 추가/제거
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id; // 인증된 사용자 ID
    const { job_id } = req.body; // 요청 본문에서 job_id 추출

    if (!job_id) {
      return res.status(400).json({ status: 'error', message: 'Job ID is required' });
    }

    const result = await bookmarkService.toggleBookmark(userId, job_id);

    if (result.added) {
      return res.status(200).json({ status: 'success', message: 'Bookmark added successfully' });
    } else {
      return res.status(200).json({ status: 'success', message: 'Bookmark removed successfully' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 북마크 목록 조회
 * @param {Object} req 요청
 * @param {Object} res 응답
 * @param {Function} next errorHanler
 */
exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id; // 인증된 사용자 ID
    const { page = 1, limit = 10 } = req.query; // 페이지네이션 파라미터 (기본값: 페이지 1, 10개씩)

    const bookmarks = await bookmarkService.getBookmarks(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: bookmarks.data,
      pagination: {
        total: bookmarks.total,
        page: bookmarks.page,
        limit: bookmarks.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};
