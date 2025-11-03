import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { postsService } from '../../application/posts.service';
import { blogsService } from '../../../blogs/application/blogs.service';
import { PostViewModel } from '../../types/post.view-model';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';
import { QueryPostList } from '../../input/query-post-list';
import { Paginated } from '../../../core/types/paginated';

export async function getPostListHandler(
  req: Request,
  res: Response<Paginated<PostViewModel[]>>,
) {
  const queryParams = matchedData<QueryPostList>(req, {
    locations: ['query'],
    includeOptionals: true,
  });
  const { items, totalCount } = await postsService.findMany(queryParams);
  const blogIds = items.map(({ blogId }) => blogId);
  const blogNamesById = await blogsService.findNamesByIds(blogIds);
  const postViewModels = items.map((post) =>
    mapToPostViewModel(post, blogNamesById[post.blogId]),
  );

  res.json({
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    totalCount,
    items: postViewModels,
  });
}
