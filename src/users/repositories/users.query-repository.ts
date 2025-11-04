import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const usersQueryRepository = {
  findById(id: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  },

  findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    return userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },

  findByLogin(login: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ login });
  },

  findByEmail(email: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ email });
  },
};
