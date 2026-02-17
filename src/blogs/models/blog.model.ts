import { HydratedDocument, model, Schema } from 'mongoose';
import { Blog } from '../types/blog';

const blogSchema = new Schema<Blog>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const BlogModel = model<Blog>('blog', blogSchema);
export type BlogDocument = HydratedDocument<Blog>;
