import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { postDtoValidationMiddleware } from '../validation/post-dto-validation.middleware';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { queryPostListValidationMiddleware } from '../validation/query-post-list-validation.middleware';

export const postsRouter = Router({});

postsRouter
  .get(
    '/',
    queryPostListValidationMiddleware,
    reqValidationResultMiddleware,
    getPostListHandler,
  )

  .post(
    '/',
    superAdminGuardMiddleware,
    postDtoValidationMiddleware,
    reqValidationResultMiddleware,
    createPostHandler,
  )

  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    getPostHandler,
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    postDtoValidationMiddleware,
    reqValidationResultMiddleware,
    updatePostHandler,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    deletePostHandler,
  );
