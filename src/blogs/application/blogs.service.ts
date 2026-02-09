import { blogsRepository } from '../../composition.root';
import { BlogCreateDto } from '../dto/blog.create-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';

export const blogsService = {
  create(dto: BlogCreateDto): Promise<string> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
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
