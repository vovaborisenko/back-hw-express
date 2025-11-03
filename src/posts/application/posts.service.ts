import { ObjectId } from 'mongodb';
import { postsRepository } from '../repositories/posts.repository';
import { PostCreateDto } from '../dto/post.create-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { PostUpdateDto } from '../dto/post.update-dto';
import { blogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';

export const postsService = {
  async create(dto: PostCreateDto): Promise<string> {
    const blog = await blogsQueryRepository.findById(dto.blogId);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: new ObjectId(dto.blogId),
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
