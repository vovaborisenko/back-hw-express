import { Request, Response } from 'express';
import { Blog } from '../../types/blogs';
import { blogsRepository } from '../../repositories/blogs.repository';

export function getBlogListHandler(req: Request, res: Response<Blog[]>) {
  res.json(blogsRepository.findAll());
}
