import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { PostCreateDto } from '../../dto/post.create-dto';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { PostViewModel } from '../../types/post.view-model';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export async function createPostHandler(
  req: Request<{}, {}, PostCreateDto>,
  res: Response<PostViewModel>,
) {
  const blog = await blogsRepository.findById(req.body.blogId);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  const newPost = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  };

  const createdPost = await postsRepository.create(newPost);

  res.status(HttpStatus.Created).json(mapToPostViewModel(createdPost, blog));
}
