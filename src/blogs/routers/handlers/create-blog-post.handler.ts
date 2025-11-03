import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../../posts/types/post.view-model';
import { postsService } from '../../../posts/application/posts.service';
import { blogsService } from '../../application/blogs.service';
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
  const [createdPost, blogMap] = await Promise.all([
    postsService.findById(createdPostId),
    blogsService.findNamesByIds([req.params.id]),
  ]);

  if (!createdPost) {
    throw new NotExistError('Post');
  }

  res
    .status(HttpStatus.Created)
    .json(mapToPostViewModel(createdPost, blogMap[req.params.id]));
}
