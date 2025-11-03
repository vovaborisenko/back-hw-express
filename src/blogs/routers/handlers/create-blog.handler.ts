import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { BlogCreateDto } from '../../dto/blog.create-dto';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { blogsService } from '../../application/blogs.service';
import { NotExistError } from '../../../core/errors/not-exist.error';

export async function createBlogHandler(
  req: Request<{}, {}, BlogCreateDto>,
  res: Response<BlogViewModel>,
) {
  const createdBlogId = await blogsService.create(req.body);
  const createdBlog = await blogsService.findById(createdBlogId);

  if (!createdBlog) {
    throw new NotExistError('Blog');
  }

  res.status(HttpStatus.Created).json(mapToBlogViewModel(createdBlog));
}
