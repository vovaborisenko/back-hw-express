import { QueryBlogList } from '../input/query-blog-list';
import { WithId } from 'mongodb';
import { Blog } from '../types/blog';
import { blogsRepository } from '../repositories/blogs.repository';

export const blogsService = {
  async findMany(
    queryDto: QueryBlogList,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findAll(queryDto);
  },
};
