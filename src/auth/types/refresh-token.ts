import { ObjectId } from 'mongodb';

export interface RefreshToken {
  token: string;
  userId: ObjectId;
  expiresAt: Date;
}
