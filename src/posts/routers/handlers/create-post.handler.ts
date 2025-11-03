import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsService } from '../../application/posts.service';
import { PostCreateDto } from '../../dto/post.create-dto';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../types/post.view-model';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export async function createPostHandler(
  req: Request<{}, {}, PostCreateDto>,
  res: Response<PostViewModel>,
) {
  const createdPostId = await postsService.create(req.body);
  const createdPost = await postsService.findById(createdPostId);

  if (!createdPost) {
    throw new NotExistError('Post');
  }

  res.status(HttpStatus.Created).json(mapToPostViewModel(createdPost));
}
