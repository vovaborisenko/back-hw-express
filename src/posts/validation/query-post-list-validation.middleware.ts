import { queryPaginationValidationMiddleware } from '../../core/middlewares/validation/query-pagination-validation.middleware';
import { getQuerySortingValidationMiddleware } from '../../core/middlewares/validation/query-sorting-validation.middleware';
import { postSortFields } from '../input/post-sort-fields';

export const queryPostListValidationMiddleware = [
  ...queryPaginationValidationMiddleware,
  ...getQuerySortingValidationMiddleware(postSortFields),
];
