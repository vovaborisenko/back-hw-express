import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { validatePostUpdateDto } from '../../validation/validate-post-update-dto';
import { postsRepository } from '../../repositories/posts.repository';
import { ErrorMessages } from '../../../core/types/validation';
import { PostUpdateDto } from '../../dto/post.update-dto';

export function updatePostHandler(
  req: Request<{ id: string }, {}, PostUpdateDto>,
  res: Response<ErrorMessages<PostUpdateDto> | undefined>,
) {
  const errors = validatePostUpdateDto(req.body);

  if (errors.length) {
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));

    return;
  }

  try {
    postsRepository.update(req.params.id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.NotFound);
  }
}
