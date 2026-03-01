import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { PostsQueryRepository } from '../../repositories/posts.query-repository';
import { PostViewModel } from '../../types/post.view-model';
import { QueryPostList } from '../../input/query-post-list';
import { Paginated } from '../../../core/types/paginated';

export function createGetPostListHandler(
  postsQueryRepository: PostsQueryRepository,
): RequestHandler<{}, Paginated<PostViewModel[]>> {
  return async function (req, res) {
    const queryParams = matchedData<QueryPostList>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const paginatedPosts = await postsQueryRepository.findMany(queryParams, {
      userId: req.user?.id,
    });

    res.json(paginatedPosts);
  };
}
