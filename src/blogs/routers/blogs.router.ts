import { Router } from 'express';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { blogDtoValidationMiddleware } from '../validation/blog-dto-validation.middleware';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { queryBlogListValidationMiddleware } from '../validation/query-blog-list-validation.middleware';
import { queryPostListValidationMiddleware } from '../../posts/validation/query-post-list-validation.middleware';
import { blogPostDtoValidationMiddleware } from '../validation/blog-post-dto-validation.middleware';
import { blogController } from '../../composition.root';

export const blogsRouter = Router({});

blogsRouter
  .get(
    '/',
    queryBlogListValidationMiddleware,
    reqValidationResultMiddleware,
    blogController.getItems,
  )

  .post(
    '/',
    superAdminGuardMiddleware,
    blogDtoValidationMiddleware,
    reqValidationResultMiddleware,
    blogController.createItem,
  )

  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    blogController.getItem,
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    blogDtoValidationMiddleware,
    reqValidationResultMiddleware,
    blogController.updateItem,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    blogController.deleteItem,
  )

  .get(
    '/:id/posts',
    paramIdValidationMiddleware(),
    queryPostListValidationMiddleware,
    reqValidationResultMiddleware,
    blogController.getItemPosts,
  )

  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    blogPostDtoValidationMiddleware,
    reqValidationResultMiddleware,
    blogController.createItemPost,
  );
