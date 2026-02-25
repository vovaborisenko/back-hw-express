import { RequestHandler } from 'express';
import { PostsQueryRepository } from '../../repositories/posts.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../types/post.view-model';

export function createGetPostHandler(
  postsQueryRepository: PostsQueryRepository,
): RequestHandler<{ id: string }, PostViewModel> {
  return async function getPostHandler(req, res) {
    const post = await postsQueryRepository.findById(
      req.params.id,
      req.user?.id,
    );

    if (!post) {
      throw new NotExistError('Post');
    }

    res.json(post);
  };
}
