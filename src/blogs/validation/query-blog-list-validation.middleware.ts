import { queryPaginationValidationMiddleware } from '../../core/middlewares/validation/query-pagination-validation.middleware';
import { getQuerySortingValidationMiddleware } from '../../core/middlewares/validation/query-sorting-validation.middleware';
import { blogSortFields } from '../input/blog-sort-fields';
import { query } from 'express-validator';

export const queryBlogListValidationMiddleware = [
  ...queryPaginationValidationMiddleware,
  ...getQuerySortingValidationMiddleware(blogSortFields),

  query('searchNameTerm')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ min: 1 }),
];
