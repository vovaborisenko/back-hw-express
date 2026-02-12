import { ObjectId } from 'mongodb';
import { PostsRepository } from '../repositories/posts.repository';
import { PostCreateDto } from '../dto/post.create-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { PostUpdateDto } from '../dto/post.update-dto';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';

export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async create(dto: PostCreateDto): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: new ObjectId(dto.blogId),
      createdAt: new Date(),
    };

    return this.postsRepository.create(newPost);
  }

  update(id: string, dto: PostUpdateDto): Promise<void> {
    return this.postsRepository.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }
}
