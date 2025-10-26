import { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { blogDtoValidationMiddleware } from '../validation/blog-dto-validation.middleware';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { queryBlogListValidationMiddleware } from '../validation/query-blog-list-validation.middleware';

export const blogsRouter = Router({});

blogsRouter
  .get(
    '/',
    queryBlogListValidationMiddleware,
    reqValidationResultMiddleware,
    getBlogListHandler,
  )

  .post(
    '/',
    superAdminGuardMiddleware,
    blogDtoValidationMiddleware,
    reqValidationResultMiddleware,
    createBlogHandler,
  )

  .get(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    getBlogHandler,
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    blogDtoValidationMiddleware,
    reqValidationResultMiddleware,
    updateBlogHandler,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    deleteBlogHandler,
  );
