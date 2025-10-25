import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsRepository } from '../../repositories/posts.repository';

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  await postsRepository.delete(req.params.id);

  res.sendStatus(HttpStatus.NoContent);
}
