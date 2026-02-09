import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { CommentUpdateDto } from '../../dto/comment.update-dto';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ErrorMessages } from '../../../core/types/validation';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';
import { CommentsService } from '../../application/comments.service';

export function createUpdateCommentHandler(
  commentsService: CommentsService,
): RequestHandler<{ id: string }, undefined | ErrorMessages, CommentUpdateDto> {
  return async function (req, res): Promise<void> {
    const userId = req.user!.id;

    const result = await commentsService.update(
      req.params.id,
      userId,
      req.body,
    );

    if (result.status !== ResultStatus.Success) {
      res
        .status(resultStatusToHttpStatus(result.status))
        .json(createErrorMessages(result.extensions));

      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  };
}
