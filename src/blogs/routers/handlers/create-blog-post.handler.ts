import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../../posts/types/post.view-model';
import { mapToPostViewModel } from '../../../posts/routers/mappers/map-to-post-view-model';
import { BlogPostCreateDto } from '../../dto/blog-post.create-dto';
import { PostsService } from '../../../posts/application/posts.service';
import { PostsQueryRepository } from '../../../posts/repositories/posts.query-repository';

export function createCreateBlogPostHandler(
  postsService: PostsService,
  postsQueryRepository: PostsQueryRepository,
): RequestHandler<{ id: string }, PostViewModel, BlogPostCreateDto> {
  return async function (req, res) {
    const createdPostId = await postsService.create({
      ...req.body,
      blogId: req.params.id,
    });
    const createdPost = await postsQueryRepository.findById(createdPostId);

    if (!createdPost) {
      throw new NotExistError('Post');
    }

    res.status(HttpStatus.Created).json(mapToPostViewModel(createdPost));
  };
}
