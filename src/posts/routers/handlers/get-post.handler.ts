import { Request, Response } from 'express';
import { Post } from '../../types/posts';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<Post>,
) {
  const post = postsRepository.findById(req.params.id);

  if (!post) {
    throw new NotExistError('Post');
  }

  const blog = blogsRepository.findById(post.blogId);

  res.json({
    ...post,
    blogName: blog?.name || null,
  });
}
