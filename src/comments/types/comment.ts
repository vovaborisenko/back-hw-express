import { ObjectId } from 'mongodb';

export interface Comment {
  content: string;
  postId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
}

export interface AggregatedComment extends Comment {
  userLogin: string | null;
}
