import { QueryPagination } from '../../core/types/query-pagination';
import { QuerySorting } from '../../core/types/query-sorting';
import { UserSortField } from './user-sort-fields';

export type QueryUserList = QueryPagination &
  QuerySorting<UserSortField> & {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
  };
