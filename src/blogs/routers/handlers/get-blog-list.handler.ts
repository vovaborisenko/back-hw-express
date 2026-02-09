import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { Paginated } from '../../../core/types/paginated';
import { QueryBlogList } from '../../input/query-blog-list';
import { BlogsQueryRepository } from '../../repositories/blogs.query-repository';

export function createGetBlogListHandler(
  blogsQueryRepository: BlogsQueryRepository,
): RequestHandler<{}, Paginated<BlogViewModel[]>> {
  return async function (req, res) {
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
  };
}
