import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { ErrorMessages } from '../../../core/types/validation';
import { validatePostCreateDto } from '../../validation/validate-post-create-dto';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { Post } from '../../types/posts';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { PostCreateDto } from '../../dto/post.create-dto';

export function createPostHandler(
  req: Request<{}, {}, PostCreateDto>,
  res: Response<Post | ErrorMessages<PostCreateDto>>,
) {
  const errors = validatePostCreateDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));

    return;
  }

  const blog = blogsRepository.findById(req.body.blogId);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);

    return;
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
