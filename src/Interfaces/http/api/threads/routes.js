import express from 'express';
import authMiddleware from '../../middlewares/auth.js';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/', authMiddleware(container), handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadByIdHandler);

  return router;
};

export default createThreadsRouter;
