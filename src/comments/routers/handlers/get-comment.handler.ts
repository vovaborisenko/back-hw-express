import { RequestHandler } from 'express';
import { CommentViewModel } from '../../types/comment.view-model';
import { HttpStatus } from '../../../core/types/http-status';
import { CommentsQueryRepository } from '../../repositories/comments.query-repository';

export function createGetCommentHandler(
  commentsQueryRepository: CommentsQueryRepository,
): RequestHandler<{ id: string }, CommentViewModel | undefined> {
  return async function (req, res) {
    const comment = await commentsQueryRepository.findById(
      req.params.id,
      req.user?.id,
    );

    if (!comment) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.send(comment);
  };
}
