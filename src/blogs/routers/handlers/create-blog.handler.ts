import { Request, Response } from 'express';
import { Blog } from '../../types/blog';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogCreateDto } from '../../dto/blog.create-dto';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export async function createBlogHandler(
  req: Request<{}, {}, BlogCreateDto>,
  res: Response<BlogViewModel>,
) {
  const newBlog = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    isMembership: false,
  };

  const createdBlog = await blogsRepository.create(newBlog);

  res.status(HttpStatus.Created).json(mapToBlogViewModel(createdBlog));
}
