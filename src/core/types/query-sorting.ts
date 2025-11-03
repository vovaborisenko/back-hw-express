import { SortDirection } from './sort-direction';

export interface QuerySorting<S> {
  sortBy: S;
  sortDirection: SortDirection;
}
