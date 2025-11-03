import { QueryBlogList } from '../input/query-blog-list';
import { WithId } from 'mongodb';
import { Blog } from '../types/blog';
import { blogsRepository } from '../repositories/blogs.repository';
import { BlogCreateDto } from '../dto/blog.create-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';

export const blogsService = {
  findMany(
    queryDto: QueryBlogList,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findAll(queryDto);
  },

  findById(id: string): Promise<WithId<Blog> | null> {
    return blogsRepository.findById(id);
  },

  findNamesByIds(
    ids: string[],
  ): Promise<Record<string, WithId<Pick<Blog, 'name'>>>> {
    return blogsRepository.findNamesByIds(ids);
  },

  create(dto: BlogCreateDto): Promise<string> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
    };

    return blogsRepository.create(newBlog);
  },

  update(id: string, dto: BlogUpdateDto): Promise<void> {
    return blogsRepository.update(id, dto);
  },

  delete(id: string): Promise<void> {
    return blogsRepository.delete(id);
  },
};
