import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogCreateDto } from '../dto/blog.create-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';
import { inject, injectable } from 'inversify';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  create(dto: BlogCreateDto): Promise<string> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };

    return this.blogsRepository.create(newBlog);
  }

  update(id: string, dto: BlogUpdateDto): Promise<void> {
    return this.blogsRepository.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.blogsRepository.delete(id);
  }
}
