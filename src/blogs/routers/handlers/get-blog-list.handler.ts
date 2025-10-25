import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export async function getBlogListHandler(
  req: Request,
  res: Response<BlogViewModel[]>,
) {
  const blogs = (await blogsRepository.findAll()).map(mapToBlogViewModel);

  res.json(blogs);
}
