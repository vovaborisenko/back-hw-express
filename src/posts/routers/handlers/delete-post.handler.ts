import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsRepository } from '../../repositories/posts.repository';

export function deletePostHandler(req: Request<{ id: string }>, res: Response) {
  try {
    postsRepository.delete(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.NotFound);
  }
}
