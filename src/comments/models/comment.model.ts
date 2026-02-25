import { HydratedDocument, model, Schema } from 'mongoose';
import { Comment } from '../types/comment';
import { virtualFields } from '../../likes/models/like.model';

const commentSchema = new Schema<Comment>(
  {
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    virtuals: virtualFields,
  },
);

export const CommentModel = model<Comment>('Comment', commentSchema);
export type CommentDocument = HydratedDocument<Comment>;
