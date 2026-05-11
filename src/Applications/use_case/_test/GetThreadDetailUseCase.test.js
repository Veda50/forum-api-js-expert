import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
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
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByCommentId = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
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
          replies: [
            {
              id: 'reply-123',
              username: 'johndoe',
              date: '2023',
              content: 'abc',
            },
          ],
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2023',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-123',
              username: 'johndoe',
              date: '2023',
              content: 'abc',
            },
          ],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-456');
  });
});
