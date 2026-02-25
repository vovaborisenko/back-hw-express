import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Like, LikeStatus } from '../types/like';

const likeSchema = new Schema<Like>({
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: LikeStatus, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
});

export const virtualFields = {
  likesCount: {
    options: {
      ref: 'Like',
      localField: '_id',
      foreignField: 'parent',
      count: true,
      match: { status: LikeStatus.Like },
    },
  },
  dislikesCount: {
    options: {
      ref: 'Like',
      localField: '_id',
      foreignField: 'parent',
      count: true,
      match: { status: LikeStatus.Dislike },
    },
  },
  newestLikes: {
    options: {
      ref: 'Like',
      localField: '_id',
      foreignField: 'parent',
      match: { status: LikeStatus.Like },
      perDocumentLimit: 3,
      options: { sort: { createdAt: -1 }, limit: 3 },
    },
  },
  myStatus: {
    options: {
      ref: 'Like',
      localField: '_id',
      foreignField: 'parent',
      justOne: true,
    },
  },
};

export const LikeModel = mongoose.model<Like>('Like', likeSchema);
export type LikeDocument = HydratedDocument<Like>;
