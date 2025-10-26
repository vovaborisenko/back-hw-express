import { query } from 'express-validator';

const enum DefaultPagination {
  PageNumber = 1,
  PageSize = 10,
}

const pageNumberValidationChain = query('pageNumber')
  .default(DefaultPagination.PageNumber)
  .isInt({ min: 1 })
  .withMessage('Should be positive integer')
  .toInt();

const pageSizeValidationChain = query('pageSize')
  .default(DefaultPagination.PageSize)
  .isInt({ min: 1, max: 100 })
  .withMessage('Should be between 1 and 100')
  .toInt();

export const queryPaginationValidationMiddleware = [
  pageNumberValidationChain,
  pageSizeValidationChain,
];
