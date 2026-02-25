import { Types } from 'mongoose';
import { BlogDocument } from '../../blogs/models/blog.model';
import { Like } from '../../likes/types/like';
import { UserDocument } from '../../users/models/user.model';
import { LikeDocument } from '../../likes/models/like.model';

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blog: Types.ObjectId;
  createdAt: Date;
}
export type PopulatingBlog = Pick<BlogDocument, '_id' | 'name'>;
export type PopulatingUser = Pick<UserDocument, '_id' | 'login'>;
export type PopulatingLike = Pick<LikeDocument, '_id' | 'status'>;

export interface PopulatedPost extends Omit<Post, 'blog'> {
  _id: Types.ObjectId;
  blog: PopulatingBlog;
  dislikesCount: number;
  likesCount: number;
  newestLikes: Array<Omit<Like, 'author'> & { author: PopulatingUser }>;
  myStatus: PopulatingLike;
}
