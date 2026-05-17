import express from 'express';
import authMiddleware from '../../middlewares/auth.js';

const createCommentsRouter = (handler, container) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authMiddleware(container), handler.postCommentHandler);
  router.delete('/:commentId', authMiddleware(container), handler.deleteCommentHandler);
  router.put('/:commentId/likes', authMiddleware(container), handler.putCommentLikeHandler);

  return router;
};

export default createCommentsRouter;
