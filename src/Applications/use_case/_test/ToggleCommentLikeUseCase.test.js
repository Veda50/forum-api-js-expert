import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrate the like action when the comment is not yet liked', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isCommentLikedByUser = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.unlikeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await toggleCommentLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isCommentLikedByUser).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.likeComment).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.unlikeComment).not.toHaveBeenCalled();
  });

  it('should orchestrate the unlike action when the comment is already liked', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isCommentLikedByUser = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.likeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.unlikeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await toggleCommentLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isCommentLikedByUser).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.unlikeComment).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockLikeRepository.likeComment).not.toHaveBeenCalled();
  });
});
