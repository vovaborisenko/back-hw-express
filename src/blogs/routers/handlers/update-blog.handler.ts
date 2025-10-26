import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogUpdateDto } from '../../dto/blog.update-dto';

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogUpdateDto>,
  res: Response<undefined>,
) {
  await blogsRepository.update(req.params.id, req.body);

  res.sendStatus(HttpStatus.NoContent);
}
