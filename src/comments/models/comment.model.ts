import { HydratedDocument, model, Schema } from 'mongoose';
import { Comment } from '../types/comment';

const commentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CommentModel = model<Comment>('Comment', commentSchema);
export type CommentDocument = HydratedDocument<Comment>;
