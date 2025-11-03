import { PostViewModel } from '../types/post.view-model';

export const postSortFields = [
  'createdAt',
  'title',
  'shortDescription',
  'content',
  'blogId',
  'blogName',
] satisfies Array<keyof PostViewModel>;

export type PostSortField = (typeof postSortFields)[number];
