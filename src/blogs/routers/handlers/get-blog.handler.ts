import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response<BlogViewModel>,
) {
  const blog = await blogsService.findById(req.params.id);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  res.json(mapToBlogViewModel(blog));
}
