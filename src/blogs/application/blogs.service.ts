import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogCreateDto } from '../dto/blog.create-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';
import { inject, injectable } from 'inversify';
import { BlogModel } from '../models/blog.model';
import { Types } from 'mongoose';
import { NotExistError } from '../../core/errors/not-exist.error';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  async create(dto: BlogCreateDto): Promise<Types.ObjectId> {
    const blogDocument = new BlogModel();

    blogDocument.name = dto.name;
    blogDocument.description = dto.description;
    blogDocument.websiteUrl = dto.websiteUrl;
    blogDocument.isMembership = false;

    await this.blogsRepository.save(blogDocument);

    return blogDocument._id;
  }

  async update(id: string, dto: BlogUpdateDto): Promise<void> {
    const blogDocument = await this.blogsRepository.findById(id);

    if (!blogDocument) {
      throw new NotExistError('Blog');
    }

    Object.assign(blogDocument, dto);

    await this.blogsRepository.save(blogDocument);

    return;
  }

  delete(id: string): Promise<void> {
    return this.blogsRepository.delete(id);
  }
}
