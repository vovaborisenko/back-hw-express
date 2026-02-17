import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { BlogViewModel } from '../../types/blog.view-model';
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

    const paginatedBlogs = await blogsQueryRepository.findMany(queryParams);

    res.json(paginatedBlogs);
  };
}
