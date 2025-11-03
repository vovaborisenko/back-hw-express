import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { blogsService } from '../../../blogs/application/blogs.service';
import { PostUpdateDto } from '../../dto/post.update-dto';
import { postsService } from '../../application/posts.service';
import { NotExistError } from '../../../core/errors/not-exist.error';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostUpdateDto>,
  res: Response<undefined>,
) {
  const blog = await blogsService.findById(req.body.blogId);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  await postsService.update(req.params.id, req.body);

  res.sendStatus(HttpStatus.NoContent);
}
