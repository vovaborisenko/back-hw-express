import { Router } from 'express';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { getCommentHandler } from './handlers/get-comment.handler';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { commentUpdateDtoValidationMiddleware } from '../validation/comment-update-dto-validation.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';

export const commentsRouter = Router({});

commentsRouter
  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    getCommentHandler,
  )

  .put(
    '/:id',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    commentUpdateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    updateCommentHandler,
  )

  .delete(
    '/:id',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    deleteCommentHandler,
  );
