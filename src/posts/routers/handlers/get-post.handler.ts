import { Request, Response } from 'express';
import { postsService } from '../../application/posts.service';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
import { PostViewModel } from '../../types/post.view-model';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<PostViewModel>,
) {
  const post = await postsService.findById(req.params.id);

  if (!post) {
    throw new NotExistError('Post');
  }

  res.json(mapToPostViewModel(post));
}
