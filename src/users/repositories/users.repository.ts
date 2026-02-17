import { NotExistError } from '../../core/errors/not-exist.error';
import { injectable } from 'inversify';
import { UserDocument, UserModel } from '../models/user.model';
import { User } from '../types/user';
import { Types } from 'mongoose';

@injectable()
export class UsersRepository {
  findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  findBy(filter: Partial<User>): Promise<UserDocument | null> {
    return UserModel.findOne(filter);
  }

  findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  findByLogin(login: string): Promise<UserDocument | null> {
    return UserModel.findOne({ login });
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  findByEmailConfirmationCode(code: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  findByRecoveryCode(code: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      'returnecovery.code': code,
      'recovery.expirationDate': { $gt: new Date() },
    });
  }

  async save(user: UserDocument): Promise<void> {
    await user.save();
  }

  // async create1(user: User): Promise<string> {
  //   const insertResult = await userCollection.insertOne(user);
  //
  //   return insertResult.insertedId.toString();
  // }
  //
  // async update1(id: string, user: Partial<User>): Promise<boolean> {
  //   const updateResult = await userCollection.updateOne(
  //     { _id: new ObjectId(id) },
  //     { $set: user },
  //   );
  //
  //   return updateResult.matchedCount === 1;
  // }
  //
  // async updateBy1(filter: Partial<User>, user: Partial<User>): Promise<boolean> {
  //   const updateResult = await userCollection.updateOne(filter, { $set: user });
  //
  //   return updateResult.matchedCount === 1;
  // }
  //
  // async updateByRecoveryCode1(
  //   code: string,
  //   user: Partial<User>,
  // ): Promise<boolean> {
  //   const updateResult = await userCollection.updateOne(
  //     {
  //       'recovery.code': code,
  //       'recovery.expirationDate': { $gt: new Date() },
  //     },
  //     { $set: user },
  //   );
  //
  //   return updateResult.matchedCount === 1;
  // }

  async delete(id: string): Promise<void> {
    const deleteResult = await UserModel.findByIdAndDelete(id);

    if (!deleteResult) {
      throw new NotExistError('User');
    }
  }
}
