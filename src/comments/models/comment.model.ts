import { HydratedDocument, model, Schema } from 'mongoose';
import { Comment } from '../types/comment';
import { LikeStatus } from '../../likes/types/like';

const commentSchema = new Schema<Comment>(
  {
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

commentSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'parent',
  count: true,
  match: { status: LikeStatus.Like },
});

commentSchema.virtual('dislikesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'parent',
  count: true,
  match: { status: LikeStatus.Dislike },
});

export const CommentModel = model<Comment>('Comment', commentSchema);
export type CommentDocument = HydratedDocument<Comment>;
