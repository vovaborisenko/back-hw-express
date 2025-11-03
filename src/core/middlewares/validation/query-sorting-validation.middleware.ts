import { query } from 'express-validator';
import { SortDirection } from '../../types/sort-direction';

const enum DefaultSorting {
  By = 'createdAt',
  Direction = SortDirection.Desc,
}

function getSortByValidationChain(
  allowedFields: string[] = [DefaultSorting.By],
) {
  return query('sortBy')
    .default(allowedFields[0])
    .isIn(allowedFields)
    .withMessage(`Sorted field must be one of: ${allowedFields.join(', ')}`);
}

const sortDirectionValidationChain = query('sortDirection')
  .default(DefaultSorting.Direction)
  .isIn(Object.values(SortDirection))
  .withMessage(
    `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
  );

export function getQuerySortingValidationMiddleware(allowedFields?: string[]) {
  return [
    getSortByValidationChain(allowedFields),
    sortDirectionValidationChain,
  ];
}
