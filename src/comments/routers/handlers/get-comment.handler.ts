import { Request, Response } from 'express';
import { mapToCommentViewModel } from '../mappers/map-to-comment-view-model';
import { CommentViewModel } from '../../types/comment.view-model';
import { commentsQueryRepository } from '../../repositories/comments.query-repository';
import { HttpStatus } from '../../../core/types/http-status';

export async function getCommentHandler(
  req: Request<{ id: string }>,
  res: Response<CommentViewModel | undefined>,
): Promise<void> {
  const comment = await commentsQueryRepository.findById(req.params.id);

  if (!comment) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.send(mapToCommentViewModel(comment));
}
