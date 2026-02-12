import { ObjectId, WithId } from 'mongodb';
import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { NotExistError } from '../../core/errors/not-exist.error';

export class UsersRepository {
  findById(id: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  }

  findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    return userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  findByLogin(login: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ login });
  }

  findByEmail(email: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ email });
  }

  findByEmailConfirmationCode(code: string): Promise<WithId<User> | null> {
    return userCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async create(user: User): Promise<string> {
    const insertResult = await userCollection.insertOne(user);

    return insertResult.insertedId.toString();
  }

  async update(id: string, user: Partial<User>): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: user },
    );

    return updateResult.matchedCount === 1;
  }

  async updateBy(filter: Partial<User>, user: Partial<User>): Promise<boolean> {
    const updateResult = await userCollection.updateOne(filter, { $set: user });

    return updateResult.matchedCount === 1;
  }

  async updateByRecoveryCode(
    code: string,
    user: Partial<User>,
  ): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      {
        'recovery.code': code,
        'recovery.expirationDate': { $gt: new Date() },
      },
      { $set: user },
    );

    return updateResult.matchedCount === 1;
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotExistError('User');
    }
  }
}
