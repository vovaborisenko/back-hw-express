import { Request, Response } from 'express';
import { Post } from '../../types/posts';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export function getPostListHandler(req: Request, res: Response<Post[]>) {
  const posts = postsRepository.findAll().map((post) => {
    const blog = blogsRepository.findById(post.blogId);

    return {
      ...post,
      blogName: blog?.name || null,
    };
  });

  res.json(posts);
}
