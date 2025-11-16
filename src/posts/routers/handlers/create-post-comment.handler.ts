import { Request, Response } from 'express';
import { PostCommentCreateDto } from '../../dto/post-comment.create-dto';
import { HttpStatus } from '../../../core/types/http-status';
import { commentsService } from '../../../comments/application/comments.service';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { commentsQueryRepository } from '../../../comments/repositories/comments.query-repository';
import { mapToCommentViewModel } from '../../../comments/routers/mappers/map-to-comment-view-model';

export async function createPostCommentHandler(
  req: Request<{ id: string }, {}, PostCommentCreateDto>,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const result = await commentsService.create(req.body, req.params.id, userId);

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultStatusToHttpStatus(result.status))
      .send(createErrorMessages(result.extensions));

    return;
  }

  const createdComment = await commentsQueryRepository.findById(result.data);

  if (!createdComment) {
    res.sendStatus(HttpStatus.NotFound);

    return;
  }

  res.status(HttpStatus.Created).send(mapToCommentViewModel(createdComment));
}
