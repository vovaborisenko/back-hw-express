import { Router } from 'express';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { postDtoValidationMiddleware } from '../validation/post-dto-validation.middleware';
import { postCommentDtoValidationMiddleware } from '../validation/post-comment-dto-validation.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { queryPostListValidationMiddleware } from '../validation/query-post-list-validation.middleware';
import { queryCommentListValidationMiddleware } from '../../comments/validation/query-comment-list-validation.middleware';
import { container } from '../../composition.root';
import { PostsController } from './posts.controller';

const postsController = container.get(PostsController);

export const postsRouter = Router({});

postsRouter
  .get(
    '/',
    queryPostListValidationMiddleware,
    reqValidationResultMiddleware,
    postsController.getItems,
  )

  .post(
    '/',
    superAdminGuardMiddleware,
    postDtoValidationMiddleware,
    reqValidationResultMiddleware,
    postsController.createItem,
  )

  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    postsController.getItem,
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    postDtoValidationMiddleware,
    reqValidationResultMiddleware,
    postsController.updateItem,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    postsController.deleteItem,
  )

  .get(
    '/:id/comments',
    paramIdValidationMiddleware(),
    queryCommentListValidationMiddleware,
    reqValidationResultMiddleware,
    postsController.getItemComments,
  )

  .post(
    '/:id/comments',
    accessTokenGuard,
    paramIdValidationMiddleware(),
    postCommentDtoValidationMiddleware,
    reqValidationResultMiddleware,
    postsController.createItemComment,
  );
