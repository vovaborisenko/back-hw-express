import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { Blog } from '../../types/blogs';
import { HttpStatus } from '../../../core/types/http-status';
import { ErrorMessages } from '../../../core/types/validation';
import { validateBlogCreateDto } from '../../validation/validate-blog-create-dto';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { blogsRepositiry } from '../../repositories/blogs.repository';

export function createBlogHandler(
  req: Request,
  res: Response<Blog | ErrorMessages>,
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

  blogsRepositiry.create(blog);

  res.status(HttpStatus.Created).json(blog);
}
