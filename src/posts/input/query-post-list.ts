import { QueryPagination } from '../../core/types/query-pagination';
import { QuerySorting } from '../../core/types/query-sorting';
import { PostSortField } from './post-sort-fields';

export type QueryPostList = QueryPagination & QuerySorting<PostSortField>;
