import { QueryPagination } from '../../core/types/query-pagination';
import { QuerySorting } from '../../core/types/query-sorting';
import { CommentSortField } from './comment-sort-fields';

export type QueryCommentList = QueryPagination & QuerySorting<CommentSortField>;
