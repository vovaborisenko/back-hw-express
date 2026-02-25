import { HydratedDocument, model, Schema } from 'mongoose';
import { Post } from '../types/post';
import { virtualFields } from '../../likes/models/like.model';

const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    virtuals: virtualFields,
  },
);

export const PostModel = model<Post>('Post', postSchema);
export type PostDocument = HydratedDocument<Post>;
