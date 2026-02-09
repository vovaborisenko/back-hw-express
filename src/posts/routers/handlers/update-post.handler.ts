import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { BlogsQueryRepository } from '../../../blogs/repositories/blogs.query-repository';
import { PostUpdateDto } from '../../dto/post.update-dto';
import { PostsService } from '../../application/posts.service';
import { NotExistError } from '../../../core/errors/not-exist.error';

export function createUpdatePostHandler(
  postsService: PostsService,
  blogsQueryRepository: BlogsQueryRepository,
): RequestHandler<{ id: string }, undefined, PostUpdateDto> {
  return async function updatePostHandler(req, res) {
    const blog = await blogsQueryRepository.findById(req.body.blogId);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    await postsService.update(req.params.id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  };
}
