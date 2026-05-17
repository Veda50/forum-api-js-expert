class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      const likeCount = await this._likeRepository.getLikeCountByCommentId(comment.id);

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
        likeCount: Number(likeCount),
        replies: replies.map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
        })),
      };
    }));

    return {
      ...thread,
      comments: commentsWithReplies,
    };
  }
}

export default GetThreadDetailUseCase;
