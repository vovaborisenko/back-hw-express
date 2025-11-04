import { UserViewModel } from '../types/user.view-model';

export const userSortFields = ['createdAt', 'email', 'login'] satisfies Array<
  keyof UserViewModel
>;

export type UserSortField = (typeof userSortFields)[number];
