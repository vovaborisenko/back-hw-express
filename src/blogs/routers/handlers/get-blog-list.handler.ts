import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { Paginated } from '../../../core/types/paginated';
import { QueryBlogList } from '../../input/query-blog-list';
import { blogsQueryRepository } from '../../../composition.root';

export async function getBlogListHandler(
  req: Request,
  res: Response<Paginated<BlogViewModel[]>>,
) {
  const queryParams = matchedData<QueryBlogList>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const { items, totalCount } =
    await blogsQueryRepository.findMany(queryParams);

  res.json({
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    totalCount,
    items: items.map(mapToBlogViewModel),
  });
}
