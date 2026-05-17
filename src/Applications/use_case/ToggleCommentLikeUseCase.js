class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);

    const isLiked = await this._likeRepository.isCommentLikedByUser({ commentId, userId });
    if (isLiked) {
      await this._likeRepository.unlikeComment({ commentId, userId });
    } else {
      await this._likeRepository.likeComment({ commentId, userId });
    }
  }
}

export default ToggleCommentLikeUseCase;
