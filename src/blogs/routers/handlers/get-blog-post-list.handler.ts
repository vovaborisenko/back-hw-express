import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { Paginated } from '../../../core/types/paginated';
import { PostViewModel } from '../../../posts/types/post.view-model';
import { QueryPostList } from '../../../posts/input/query-post-list';
import { BlogsQueryRepository } from '../../repositories/blogs.query-repository';
import { PostsQueryRepository } from '../../../posts/repositories/posts.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export function createGetBlogPostListHandler(
  blogsQueryRepository: BlogsQueryRepository,
  postsQueryRepository: PostsQueryRepository,
): RequestHandler<{ id: string }, Paginated<PostViewModel[]>> {
  return async function getBlogPostListHandler(req, res) {
    const blog = await blogsQueryRepository.findById(req.params.id);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    const queryParams = matchedData<QueryPostList>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const paginatedPosts = await postsQueryRepository.findMany(
      queryParams,
      req.params.id,
    );

    res.json(paginatedPosts);
  };
}
