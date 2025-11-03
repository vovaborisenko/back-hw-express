import { WithId } from 'mongodb';
import { QueryPostList } from '../input/query-post-list';
import { Post } from '../types/post';
import { postsRepository } from '../repositories/posts.repository';
import { PostCreateDto } from '../dto/post.create-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { blogsService } from '../../blogs/application/blogs.service';
import { PostUpdateDto } from '../dto/post.update-dto';

export const postsService = {
  findMany(
    queryDto: QueryPostList,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return postsRepository.findAll(queryDto);
  },

  findById(id: string): Promise<WithId<Post> | null> {
    return postsRepository.findById(id);
  },

  async create(dto: PostCreateDto): Promise<string> {
    const blog = await blogsService.findById(dto.blogId);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    };

    return postsRepository.create(newPost);
  },

  update(id: string, dto: PostUpdateDto): Promise<void> {
    return postsRepository.update(id, dto);
  },

  delete(id: string): Promise<void> {
    return postsRepository.delete(id);
  },
};
