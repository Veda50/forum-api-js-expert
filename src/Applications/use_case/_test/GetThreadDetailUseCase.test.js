import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedThread = {
      id: 'thread-123',
      title: 'abc',
      body: 'abc',
      date: '2023',
      username: 'dicoding',
    };
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2023',
        content: 'abc',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2023',
        content: 'abc',
        is_delete: true,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'johndoe',
        date: '2023',
        content: 'abc',
        is_delete: false,
      },
      {
        id: 'reply-456',
        username: 'dicoding',
        date: '2023',
        content: 'abc',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByCommentId = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));
    mockLikeRepository.getLikeCountByCommentId = vi.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') return Promise.resolve(2);
        return Promise.resolve(0);
      });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    expect(threadDetail).toStrictEqual({
      id: 'thread-123',
      title: 'abc',
      body: 'abc',
      date: '2023',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2023',
          content: 'abc',
          likeCount: 2,
          replies: [
            {
              id: 'reply-123',
              username: 'johndoe',
              date: '2023',
              content: 'abc',
            },
            {
              id: 'reply-456',
              username: 'dicoding',
              date: '2023',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2023',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [
            {
              id: 'reply-123',
              username: 'johndoe',
              date: '2023',
              content: 'abc',
            },
            {
              id: 'reply-456',
              username: 'dicoding',
              date: '2023',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-456');
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-456');
  });
});
