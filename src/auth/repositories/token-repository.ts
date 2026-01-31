import { ObjectId, WithId } from 'mongodb';
import { RefreshToken } from '../types/refresh-token';
import { refreshTokenCollection } from '../../db/mongo.db';

export const tokenRepository = {
  findToken(token: string): Promise<WithId<RefreshToken> | null> {
    return refreshTokenCollection.findOne({ token });
  },
  async insertToken(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<string> {
    const insertResult = await refreshTokenCollection.insertOne({
      token,
      userId: new ObjectId(userId),
      expiresAt,
    });

    return insertResult.insertedId.toString();
  },
};
