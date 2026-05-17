import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('isCommentLikedByUser', () => {
    it('should return false if comment is not liked by user', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isCommentLikedByUser({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      expect(isLiked).toBe(false);
    });

    it('should return true if comment is already liked by user', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isCommentLikedByUser({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      expect(isLiked).toBe(true);
    });
  });

  describe('likeComment', () => {
    it('should persist like in database', async () => {
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.likeComment({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likes = await LikesTableTestHelper.findLikeByCommentAndUser({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      expect(likes).toHaveLength(1);
      expect(likes[0].id).toBe('like-123');
    });
  });

  describe('unlikeComment', () => {
    it('should remove like from database', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.unlikeComment({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const likes = await LikesTableTestHelper.findLikeByCommentAndUser({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      expect(likes).toHaveLength(0);
    });
  });

  describe('getLikeCountByCommentId', () => {
    it('should return total likes of comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user456' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123', owner: 'user-456' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      expect(likeCount).toBe(2);
    });
  });
});
