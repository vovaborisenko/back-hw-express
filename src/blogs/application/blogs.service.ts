import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogCreateDto } from '../dto/blog.create-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';

export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

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
