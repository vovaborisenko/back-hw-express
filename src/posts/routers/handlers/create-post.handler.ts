import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { Post } from '../../types/posts';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { PostCreateDto } from '../../dto/post.create-dto';
import { NotExistError } from '../../../core/errors/not-exist.error';

export function createPostHandler(
  req: Request<{}, {}, PostCreateDto>,
  res: Response<Post>,
) {
  const blog = blogsRepository.findById(req.body.blogId);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  const postBase = {
    id: Date.now().toString(36),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  };

  postsRepository.create(postBase);

  res.status(HttpStatus.Created).json({
    ...postBase,
    blogName: blog.name,
  });
}
