/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', content = 'abc', commentId = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4)',
      values: [id, commentId, owner, content],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default RepliesTableTestHelper;
