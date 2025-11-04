import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { Paginated } from '../../../core/types/paginated';
import { PostViewModel } from '../../../posts/types/post.view-model';
import { QueryPostList } from '../../../posts/input/query-post-list';
import { blogsQueryRepository } from '../../repositories/blogs.query-repository';
import { postsQueryRepository } from '../../../posts/repositories/posts.query-repository';
import { mapToPostViewModel } from '../../../posts/routers/mappers/map-to-post-view-model';
import { NotExistError } from '../../../core/errors/not-exist.error';

export async function getBlogPostListHandler(
  req: Request<{ id: string }>,
  res: Response<Paginated<PostViewModel[]>>,
) {
  const blog = await blogsQueryRepository.findById(req.params.id);

  if (!blog) {
    throw new NotExistError('Blog');
  }

  const queryParams = matchedData<QueryPostList>(req, {
    locations: ['query'],
    includeOptionals: true,
  });
  const { items, totalCount } = await postsQueryRepository.findMany(
    queryParams,
    req.params.id,
  );
  const postViewModels = items.map((post) => mapToPostViewModel(post));

  res.json({
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    totalCount,
    items: postViewModels,
  });
}
