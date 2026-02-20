import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Like, LikeStatus } from '../types/like';

const likeSchema = new Schema<Like>({
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: LikeStatus, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
});

export const LikeModel = mongoose.model<Like>('Like', likeSchema);
export type LikeDocument = HydratedDocument<Like>;
