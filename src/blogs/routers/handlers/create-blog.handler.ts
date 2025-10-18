import { Request, Response } from 'express';
import { Blog } from '../../types/blogs';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogCreateDto } from '../../dto/blog.create-dto';

export function createBlogHandler(
  req: Request<{}, {}, BlogCreateDto>,
  res: Response<Blog>,
) {
  const blog = {
    id: Date.now().toString(32),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  blogsRepository.create(blog);

  res.status(HttpStatus.Created).json(blog);
}
