import { Request, Response } from 'express';
import { Blog } from '../../types/blogs';
import { HttpStatus } from '../../../core/types/http-status';
import { ErrorMessages } from '../../../core/types/validation';
import { validateBlogCreateDto } from '../../validation/validate-blog-create-dto';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogCreateDto } from '../../dto/blog.create-dto';

export function createBlogHandler(
  req: Request<{}, {}, BlogCreateDto>,
  res: Response<Blog | ErrorMessages<BlogCreateDto>>,
) {
  const errors = validateBlogCreateDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));

    return;
  }

  const blog = {
    id: Date.now().toString(32),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  blogsRepository.create(blog);

  res.status(HttpStatus.Created).json(blog);
}
