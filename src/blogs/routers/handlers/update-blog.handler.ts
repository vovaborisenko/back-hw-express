import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { BlogUpdateDto } from '../../dto/blog.update-dto';
import { BlogsService } from '../../application/blogs.service';

export function createUpdateBlogHandler(
  blogsService: BlogsService,
): RequestHandler<{ id: string }, undefined, BlogUpdateDto> {
  return async function (req, res) {
    await blogsService.update(req.params.id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  };
}
