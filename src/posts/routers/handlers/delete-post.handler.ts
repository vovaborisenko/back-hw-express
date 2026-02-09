import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { PostsService } from '../../application/posts.service';

export function createDeletePostHandler(
  postsService: PostsService,
): RequestHandler<{ id: string }, undefined> {
  return async function (req, res) {
    await postsService.delete(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  };
}
