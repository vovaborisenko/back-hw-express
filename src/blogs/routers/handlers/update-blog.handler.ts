import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { validateBlogUpdateDto } from '../../validation/validate-blog-update-dto';
import { blogsRepositiry } from '../../repositories/blogs.repository';
import { ErrorMessages } from '../../../core/types/validation';

export function updateBlogHandler(
  req: Request<{ id: string }>,
  res: Response<ErrorMessages | undefined>,
) {
  const errors = validateBlogUpdateDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));

    return;
  }

  try {
    blogsRepositiry.update(req.params.id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.NotFound);
  }
}
