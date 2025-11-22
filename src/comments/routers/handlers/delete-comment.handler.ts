import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { commentsService } from '../../application/comments.service';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';

export async function deleteCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const result = await commentsService.delete(req.params.id, userId);

  if (result.status !== ResultStatus.Success) {
    res.sendStatus(resultStatusToHttpStatus(result.status));

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
