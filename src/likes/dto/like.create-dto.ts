import { LikeStatus } from '../types/like';
import { Types } from 'mongoose';

export interface LikeCreateDto {
  status: LikeStatus;
  authorId: Types.ObjectId;
  parentId: Types.ObjectId;
}
