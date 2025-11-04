import { Request, Response } from 'express';
import { postsQueryRepository } from '../../repositories/posts.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
import { PostViewModel } from '../../types/post.view-model';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<PostViewModel>,
) {
  const post = await postsQueryRepository.findById(req.params.id);

  if (!post) {
    throw new NotExistError('Post');
  }

  res.json(mapToPostViewModel(post));
}
