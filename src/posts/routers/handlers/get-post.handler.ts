import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
import { PostViewModel } from '../../types/post.view-model';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<PostViewModel>,
) {
  const post = await postsRepository.findById(req.params.id);

  if (!post) {
    throw new NotExistError('Post');
  }

  const blog = await blogsRepository.findById(post.blogId);

  res.json(mapToPostViewModel(post, blog));
}
