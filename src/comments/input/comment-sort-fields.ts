import { CommentViewModel } from '../types/comment.view-model';

export const commentSortFields = ['createdAt', 'content'] satisfies Array<
  keyof CommentViewModel
>;

export type CommentSortField = (typeof commentSortFields)[number];
