import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsRepository } from '../../repositories/posts.repository';
import { PostUpdateDto } from '../../dto/post.update-dto';

export function updatePostHandler(
  req: Request<{ id: string }, {}, PostUpdateDto>,
  res: Response<undefined>,
) {
  postsRepository.update(req.params.id, req.body);

  res.sendStatus(HttpStatus.NoContent);
}
