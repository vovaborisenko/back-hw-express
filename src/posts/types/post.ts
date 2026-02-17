import { Types } from 'mongoose';
import { BlogDocument } from '../../blogs/models/blog.model';

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blog: Types.ObjectId;
  createdAt: Date;
}
export type PopulatingBlog = Pick<BlogDocument, '_id' | 'name'>;

export interface PopulatedPost extends Omit<Post, 'blog'> {
  _id: Types.ObjectId;
  blog: PopulatingBlog;
}
