import AddedComment from '../../../Domains/comments/entities/AddedComment';
import NewComment from '../../../Domains/comments/entities/NewComment';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import AddCommentUseCase from '../AddCommentUseCase';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'abc',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const dummyAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = vi.fn()
      .mockImplementation(() => Promise.resolve(dummyAddedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
