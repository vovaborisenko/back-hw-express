import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { PostCreateDto } from '../../dto/post.create-dto';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../types/post.view-model';
import { PostsService } from '../../application/posts.service';
import { PostsQueryRepository } from '../../repositories/posts.query-repository';

export function createCreatePostHandler(
  postsService: PostsService,
  postsQueryRepository: PostsQueryRepository,
): RequestHandler<{}, PostViewModel, PostCreateDto> {
  return async function (req, res) {
    const createdPostId = await postsService.create(req.body);
    const createdPost = await postsQueryRepository.findById(createdPostId);

    if (!createdPost) {
      throw new NotExistError('Post');
    }

    res.status(HttpStatus.Created).json(createdPost);
  };
}
