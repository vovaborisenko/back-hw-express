import { QueryPagination } from '../../core/types/query-pagination';
import { QuerySorting } from '../../core/types/query-sorting';
import { BlogSortField } from './blog-sort-fields';

export type QueryBlogList = QueryPagination &
  QuerySorting<BlogSortField> &
  Partial<{ searchNameTerm: string }>;
