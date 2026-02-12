import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { CommentsService } from '../../application/comments.service';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';

export function createDeleteCommentHandler(
  commentsService: CommentsService,
): RequestHandler<{ id: string }, undefined> {
  return async function deleteCommentHandler(req, res) {
    const userId = req.user!.id;

    const result = await commentsService.delete(req.params.id, userId);

    if (result.status !== ResultStatus.Success) {
      res.sendStatus(resultStatusToHttpStatus(result.status));

      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  };
}
