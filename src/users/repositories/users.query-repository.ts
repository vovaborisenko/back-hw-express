import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const usersQueryRepository = {
  findById(id: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  },
};
