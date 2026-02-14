import { Filter, ObjectId, WithId } from 'mongodb';
import { User } from '../types/user';
import { userCollection } from '../../db/mongo.db';
import { QueryUserList } from '../input/query-user-list';
import { injectable } from 'inversify';

@injectable()
export class UsersQueryRepository {
  async findMany({
    pageSize,
    pageNumber,
    sortDirection,
    sortBy,
    searchLoginTerm,
    searchEmailTerm,
  }: QueryUserList): Promise<{ items: WithId<User>[]; totalCount: number }> {
    const skip = pageSize * (pageNumber - 1);
    const sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };

    const $or: Filter<User>['$or'] = [];
    if (searchLoginTerm) {
      $or.push({
        login: { $regex: searchLoginTerm, $options: 'i' },
      });
    }
    if (searchEmailTerm) {
      $or.push({
        email: { $regex: searchEmailTerm, $options: 'i' },
      });
    }
    const filter: Filter<User> = $or.length ? { $or } : {};

    const [items, totalCount] = await Promise.all([
      userCollection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      userCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  findById(id: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  }
}
