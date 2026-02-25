import { Types } from 'mongoose';
import { UserDocument } from '../../users/models/user.model';
import { LikeDocument } from '../../likes/models/like.model';

export interface Comment {
  content: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

export type PopulatingUser = Pick<UserDocument, '_id' | 'login'>;
export type PopulatingLike = Pick<LikeDocument, '_id' | 'status'>;

export interface PopulatedComment extends Omit<Comment, 'user'> {
  _id: Types.ObjectId;
  user: PopulatingUser;
  likesCount: number;
  dislikesCount: number;
  myStatus: PopulatingLike;
}
