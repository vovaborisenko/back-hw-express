import { query } from 'express-validator';
import { queryPaginationValidationMiddleware } from '../../core/middlewares/validation/query-pagination-validation.middleware';
import { getQuerySortingValidationMiddleware } from '../../core/middlewares/validation/query-sorting-validation.middleware';
import { userSortFields } from '../input/user-sort-fields';

export const queryUserListValidationMiddleware = [
  ...queryPaginationValidationMiddleware,
  ...getQuerySortingValidationMiddleware(userSortFields),
  ...['searchLoginTerm', 'searchEmailTerm'].map((queryParams) =>
    query(queryParams)
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .isLength({ min: 1 }),
  ),
];
