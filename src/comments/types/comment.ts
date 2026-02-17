import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

export interface Comment {
  content: string;
  postId: ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

export interface AggregatedComment extends Comment {
  userLogin: string | null;
}
