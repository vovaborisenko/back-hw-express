import { ObjectId, WithId } from 'mongodb';
import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { NotExistError } from '../../core/errors/not-exist.error';

export const usersRepository = {
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

  async create(user: User): Promise<string> {
    const insertResult = await userCollection.insertOne(user);

    return insertResult.insertedId.toString();
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotExistError('User');
    }
  },
};
