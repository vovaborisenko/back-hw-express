import { Types } from 'mongoose';

export interface Comment {
  content: string;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

export interface AggregatedComment extends Comment {
  userLogin: string | null;
}
