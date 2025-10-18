import { Request, Response } from 'express';
import { Blog } from '../../types/blogs';
import { blogsRepository } from '../../repositories/blogs.repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response<Blog>,
) {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  res.json(blog);
}
