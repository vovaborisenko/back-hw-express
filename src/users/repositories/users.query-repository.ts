import { injectable } from 'inversify';
import { QueryFilter, Types } from 'mongoose';
import { User } from '../types/user';
import { QueryUserList } from '../input/query-user-list';
import { UserModel } from '../models/user.model';
import { Paginated } from '../../core/types/paginated';
import { UserViewModel } from '../types/user.view-model';
import { MeViewModel } from '../../auth/types/me.view-model';

@injectable()
export class UsersQueryRepository {
  async findMany({
    pageSize,
    pageNumber,
    sortDirection,
    sortBy,
    searchLoginTerm,
    searchEmailTerm,
  }: QueryUserList): Promise<Paginated<UserViewModel[]>> {
    const skip = pageSize * (pageNumber - 1);
    const sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };

    const $or: QueryFilter<User>['$or'] = [];
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
    const filter: QueryFilter<User> = $or.length ? { $or } : {};

    const [items, totalCount] = await Promise.all([
      UserModel.find(filter).sort(sort).skip(skip).limit(pageSize).lean(),
      UserModel.countDocuments(filter),
    ]);

    return {
      page: pageNumber,
      pageSize: pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: items.map(this.toViewModel),
    };
  }

  async findById(id: string): Promise<UserViewModel | null> {
    const user = await UserModel.findById(id).lean();

    return user ? this.toViewModel(user) : null;
  }

  async findMeById(id: string): Promise<MeViewModel | null> {
    const user = await UserModel.findById(id).lean();

    return user ? this.toMeViewModel(user) : null;
  }

  private toViewModel(user: User & { _id: Types.ObjectId }): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private toMeViewModel(user: User & { _id: Types.ObjectId }): MeViewModel {
    return {
      userId: user._id.toString(),
      login: user.login,
      email: user.email,
    };
  }
}
