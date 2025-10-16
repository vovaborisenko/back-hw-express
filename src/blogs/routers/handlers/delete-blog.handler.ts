import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsRepositiry } from '../../repositories/blogs.repository';

export function deleteBlogHandler(req: Request<{ id: string }>, res: Response) {
  try {
    blogsRepositiry.delete(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.NotFound);
  }
}
