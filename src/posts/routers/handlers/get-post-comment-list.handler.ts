import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { Paginated } from '../../../core/types/paginated';
import { CommentViewModel } from '../../../comments/types/comment.view-model';
import { mapToCommentViewModel } from '../../../comments/routers/mappers/map-to-comment-view-model';
import { commentsQueryRepository } from '../../../comments/repositories/comments.query-repository';
import { QueryCommentList } from '../../../comments/input/query-comment-list';
import { postsQueryRepository } from '../../repositories/posts.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export async function getPostCommentListCommentHandler(
  req: Request<{ id: string }>,
  res: Response<Paginated<CommentViewModel[]>>,
) {
  const post = await postsQueryRepository.findById(req.params.id);

  if (!post) {
    throw new NotExistError('Post');
  }

  const queryParams = matchedData<QueryCommentList>(req, {
    locations: ['query'],
    includeOptionals: true,
  });
  const { items, totalCount } = await commentsQueryRepository.findMany(
    queryParams,
    req.params.id,
  );

  res.json({
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    totalCount,
    items: items.map(mapToCommentViewModel),
  });
}
