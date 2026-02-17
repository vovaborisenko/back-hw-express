import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { Paginated } from '../../../core/types/paginated';
import { UserViewModel } from '../../types/user.view-model';
import { QueryUserList } from '../../input/query-user-list';
import { UsersQueryRepository } from '../../repositories/users.query-repository';

export function createGetUserListHandler(
  usersQueryRepository: UsersQueryRepository,
): RequestHandler<{}, Paginated<UserViewModel[]>> {
  return async function (req, res) {
    const queryParams = matchedData<QueryUserList>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const paginatedUsers = await usersQueryRepository.findMany(queryParams);

    res.send(paginatedUsers);
  };
}
