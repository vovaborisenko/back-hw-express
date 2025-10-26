import { BlogViewModel } from '../types/blog.view-model';

export const blogSortFields = [
  'createdAt',
  'name',
  'websiteUrl',
  'description',
] satisfies Array<keyof BlogViewModel>;

export type BlogSortField = (typeof blogSortFields)[number];
