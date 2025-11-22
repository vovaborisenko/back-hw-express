import { queryPaginationValidationMiddleware } from '../../core/middlewares/validation/query-pagination-validation.middleware';
import { getQuerySortingValidationMiddleware } from '../../core/middlewares/validation/query-sorting-validation.middleware';
import { commentSortFields } from '../input/comment-sort-fields';

export const queryCommentListValidationMiddleware = [
  ...queryPaginationValidationMiddleware,
  ...getQuerySortingValidationMiddleware(commentSortFields),
];
