import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../../posts/types/post.view-model';
import { postsQueryRepository, postsService } from '../../../composition.root';
import { mapToPostViewModel } from '../../../posts/routers/mappers/map-to-post-view-model';
import { BlogPostCreateDto } from '../../dto/blog-post.create-dto';

export async function createBlogPostHandler(
  req: Request<{ id: string }, {}, BlogPostCreateDto>,
  res: Response<PostViewModel>,
) {
  const createdPostId = await postsService.create({
    ...req.body,
    blogId: req.params.id,
  });
  const createdPost = await postsQueryRepository.findById(createdPostId);

  if (!createdPost) {
    throw new NotExistError('Post');
  }

  res.status(HttpStatus.Created).json(mapToPostViewModel(createdPost));
}
