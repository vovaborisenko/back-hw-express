import { Request, Response } from 'express';
import { Post } from '../../types/posts';
import { HttpStatus } from '../../../core/types/http-status';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<Post>,
) {
  const post = postsRepository.findById(req.params.id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);

    return;
  }

  const blog = blogsRepository.findById(post.blogId);

  res.json({
    ...post,
    blogName: blog?.name || null,
  });
}
