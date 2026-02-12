import { Router } from 'express';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { commentUpdateDtoValidationMiddleware } from '../validation/comment-update-dto-validation.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';
import { commentsController } from '../../composition.root';

export const commentsRouter = Router({});

commentsRouter
  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
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

  .delete(
    '/:id',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    commentsController.deleteItem,
  );
