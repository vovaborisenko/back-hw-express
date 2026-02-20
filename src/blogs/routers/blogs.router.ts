import { Router } from 'express';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { blogDtoValidationMiddleware } from '../validation/blog-dto-validation.middleware';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { queryBlogListValidationMiddleware } from '../validation/query-blog-list-validation.middleware';
import { queryPostListValidationMiddleware } from '../../posts/validation/query-post-list-validation.middleware';
import { blogPostDtoValidationMiddleware } from '../validation/blog-post-dto-validation.middleware';
import { container } from '../../composition.root';
import { BlogsController } from './blogs.controller';

const blogsController = container.get(BlogsController);

export const blogsRouter = Router({});

blogsRouter
  .get(
    '/',
    queryBlogListValidationMiddleware,
    reqValidationResultMiddleware,
    blogsController.getItems,
  )

  .post(
    '/',
    superAdminGuardMiddleware,
    blogDtoValidationMiddleware,
    reqValidationResultMiddleware,
    blogsController.createItem,
  )

  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    blogsController.getItem,
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    blogDtoValidationMiddleware,
    reqValidationResultMiddleware,
    blogsController.updateItem,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    blogsController.deleteItem,
  )

  .get(
    '/:id/posts',
    paramIdValidationMiddleware(),
    queryPostListValidationMiddleware,
    reqValidationResultMiddleware,
    blogsController.getItemPosts,
  )

  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    blogPostDtoValidationMiddleware,
    reqValidationResultMiddleware,
    blogsController.createItemPost,
  );
