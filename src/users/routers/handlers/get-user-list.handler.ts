import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { mapToUserViewModel } from '../mappers/map-to-user-view-model';
import { Paginated } from '../../../core/types/paginated';
import { UserViewModel } from '../../types/user.view-model';
import { QueryUserList } from '../../input/query-user-list';
import { usersQueryRepository } from '../../repositories/users.query-repository';

export async function getUserListHandler(
  req: Request,
  res: Response<Paginated<UserViewModel[]>>,
): Promise<void> {
  const queryParams = matchedData<QueryUserList>(req, {
    locations: ['query'],
    includeOptionals: true,
  });
  const { items, totalCount } =
    await usersQueryRepository.findMany(queryParams);

  res.send({
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    totalCount,
    items: items.map(mapToUserViewModel),
  });
}
