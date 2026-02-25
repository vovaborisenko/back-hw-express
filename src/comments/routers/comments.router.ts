import { Router } from 'express';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { commentUpdateDtoValidationMiddleware } from '../validation/comment-update-dto-validation.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';
import { container } from '../../composition.root';
import { CommentsController } from './comments.controller';
import { likeStatusUpdateDtoValidationMiddleware } from '../../likes/validation/like-status-update-dto-validation.middleware';
import { optionalUserMiddleware } from '../../core/middlewares/optional-user.middleware';

const commentsController = container.get(CommentsController);

export const commentsRouter = Router({});

commentsRouter
  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    optionalUserMiddleware,
    commentsController.getItem,
  )

  .put(
    '/:id',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    commentUpdateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    commentsController.updateItem,
  )

  .put(
    '/:id/like-status',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    likeStatusUpdateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    commentsController.updateItemLikeStatus,
  )

  .delete(
    '/:id',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    commentsController.deleteItem,
  );
