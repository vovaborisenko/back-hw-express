import { AggregatedComment } from '../../types/comment';
import { CommentViewModel } from '../../types/comment.view-model';
import { WithId } from 'mongodb';

export function mapToCommentViewModel(
  comment: WithId<AggregatedComment>,
): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
  };
}
