import { RequestHandler } from 'express';
import { PostCommentCreateDto } from '../../dto/post-comment.create-dto';
import { HttpStatus } from '../../../core/types/http-status';
import { CommentsService } from '../../../comments/application/comments.service';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { CommentsQueryRepository } from '../../../comments/repositories/comments.query-repository';
import { CommentViewModel } from '../../../comments/types/comment.view-model';
import { ErrorMessages } from '../../../core/types/validation';

export function createCreatePostCommentHandler(
  commentsService: CommentsService,
  commentsQueryRepository: CommentsQueryRepository,
): RequestHandler<
  { id: string },
  CommentViewModel | ErrorMessages,
  PostCommentCreateDto
> {
  return async function createPostCommentHandler(req, res) {
    const userId = req.user?.id;

    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);

      return;
    }

    const result = await commentsService.create(
      req.body,
      req.params.id,
      userId,
    );

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

    res.status(HttpStatus.Created).send(createdComment);
  };
}
