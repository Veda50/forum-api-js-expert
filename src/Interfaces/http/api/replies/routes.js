import express from 'express';
import authMiddleware from '../../middlewares/auth.js';

const createRepliesRouter = (handler, container) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authMiddleware(container), handler.postReplyHandler);
  router.delete('/:replyId', authMiddleware(container), handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;
