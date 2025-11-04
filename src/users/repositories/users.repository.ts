import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { NotExistError } from '../../core/errors/not-exist.error';

export const usersRepository = {
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
