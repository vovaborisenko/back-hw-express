import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsService } from '../../application/posts.service';

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  await postsService.delete(req.params.id);

  res.sendStatus(HttpStatus.NoContent);
}
