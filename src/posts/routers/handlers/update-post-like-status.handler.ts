import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ErrorMessages } from '../../../core/types/validation';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';
import { PostsService } from '../../application/posts.service';
import { PostLikeStatusUpdateDto } from '../../dto/post-like-status.update-dto';

export function createUpdatePostLikeStatusHandler(
  postsService: PostsService,
): RequestHandler<
  { id: string },
  undefined | ErrorMessages,
  PostLikeStatusUpdateDto
> {
  return async function (req, res): Promise<void> {
    const userId = req.user!.id;

    const result = await postsService.updateLikeStatus(
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
