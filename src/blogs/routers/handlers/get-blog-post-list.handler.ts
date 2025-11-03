import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { Paginated } from '../../../core/types/paginated';
import { PostViewModel } from '../../../posts/types/post.view-model';
import { QueryPostList } from '../../../posts/input/query-post-list';
import { postsService } from '../../../posts/application/posts.service';
import { blogsService } from '../../application/blogs.service';
import { mapToPostViewModel } from '../../../posts/routers/mappers/map-to-post-view-model';

export async function getBlogPostListHandler(
  req: Request<{ id: string }>,
  res: Response<Paginated<PostViewModel[]>>,
) {
  const queryParams = matchedData<QueryPostList>(req, {
    locations: ['query'],
    includeOptionals: true,
  });
  const { items, totalCount } = await postsService.findMany(
    queryParams,
    req.params.id,
  );
  const blogNamesById = await blogsService.findNamesByIds([req.params.id]);
  const postViewModels = items.map((post) =>
    mapToPostViewModel(post, blogNamesById[req.params.id]),
  );

  res.json({
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    totalCount,
    items: postViewModels,
  });
}
