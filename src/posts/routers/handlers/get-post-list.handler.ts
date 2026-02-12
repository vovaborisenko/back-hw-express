import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { PostsQueryRepository } from '../../repositories/posts.query-repository';
import { PostViewModel } from '../../types/post.view-model';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
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
    const { items, totalCount } =
      await postsQueryRepository.findMany(queryParams);

    const postViewModels = items.map(mapToPostViewModel);

    res.json({
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      totalCount,
      items: postViewModels,
    });
  };
}
