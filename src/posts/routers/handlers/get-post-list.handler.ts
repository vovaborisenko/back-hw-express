import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { PostViewModel } from '../../types/post.view-model';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export async function getPostListHandler(
  req: Request,
  res: Response<PostViewModel[]>,
) {
  const posts = await postsRepository.findAll();
  const blogIds = posts.map(({ blogId }) => blogId);
  const blogNamesById = await blogsRepository.findNamesByIds(blogIds);
  const postViewModels = posts.map((post) =>
    mapToPostViewModel(post, blogNamesById[post.blogId]),
  );

  res.json(postViewModels);
}
