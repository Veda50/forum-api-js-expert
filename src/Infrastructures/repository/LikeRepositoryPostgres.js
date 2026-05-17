import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isCommentLikedByUser({ commentId, userId }) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async likeComment({ commentId, userId }) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };
    await this._pool.query(query);
  }

  async unlikeComment({ commentId, userId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int as count FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].count;
  }
}

export default LikeRepositoryPostgres;
