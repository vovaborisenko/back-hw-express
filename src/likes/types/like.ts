import { Types } from 'mongoose';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export interface Like {
  status: LikeStatus;
  author: Types.ObjectId;
  parent: Types.ObjectId;
  createdAt?: Date;
}
