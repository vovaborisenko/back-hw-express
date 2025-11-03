import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsService } from '../../application/blogs.service';

export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  await blogsService.delete(req.params.id);

  res.sendStatus(HttpStatus.NoContent);
}
