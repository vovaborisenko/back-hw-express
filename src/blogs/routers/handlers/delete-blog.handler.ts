import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsRepository } from '../../repositories/blogs.repository';

export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  await blogsRepository.delete(req.params.id);

  res.sendStatus(HttpStatus.NoContent);
}
