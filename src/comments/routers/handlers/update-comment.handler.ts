import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { CommentUpdateDto } from '../../dto/comment.update-dto';
import { commentsService } from '../../application/comments.service';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ErrorMessages } from '../../../core/types/validation';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';

export async function updateCommentHandler(
  req: Request<{ id: string }, {}, CommentUpdateDto>,
  res: Response<undefined | ErrorMessages>,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const result = await commentsService.update(req.params.id, userId, req.body);

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultStatusToHttpStatus(result.status))
      .json(createErrorMessages(result.extensions));

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
