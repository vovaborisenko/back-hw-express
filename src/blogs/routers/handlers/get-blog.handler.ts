import { Request, Response } from 'express';
import { Blog } from '../../types/blogs';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsRepository } from '../../repositories/blogs.repository';

export function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response<Blog>,
) {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);

    return;
  }

  res.json(blog);
}
