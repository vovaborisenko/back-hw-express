import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsRepository } from '../../repositories/posts.repository';
import { PostUpdateDto } from '../../dto/post.update-dto';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostUpdateDto>,
  res: Response<undefined>,
) {
  const blog = await blogsRepository.findById(req.body.blogId);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  await postsRepository.update(req.params.id, req.body);

  res.sendStatus(HttpStatus.NoContent);
}
