import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { BlogsService } from '../../application/blogs.service';

export function createDeleteBlogHandler(
  blogsService: BlogsService,
): RequestHandler<{ id: string }, undefined> {
  return async function (req, res) {
    await blogsService.delete(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  };
}
