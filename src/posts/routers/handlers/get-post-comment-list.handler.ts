import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { Paginated } from '../../../core/types/paginated';
import { CommentViewModel } from '../../../comments/types/comment.view-model';
import { CommentsQueryRepository } from '../../../comments/repositories/comments.query-repository';
import { QueryCommentList } from '../../../comments/input/query-comment-list';
import { PostsQueryRepository } from '../../repositories/posts.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export function createGetPostCommentListHandler(
  postsQueryRepository: PostsQueryRepository,
  commentsQueryRepository: CommentsQueryRepository,
): RequestHandler<{ id: string }, Paginated<CommentViewModel[]>> {
  return async function (req, res) {
    const post = await postsQueryRepository.findById(req.params.id);

    if (!post) {
      throw new NotExistError('Post');
    }

    const queryParams = matchedData<QueryCommentList>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const paginatedComments = await commentsQueryRepository.findMany(
      queryParams,
      req.params.id,
    );

    res.json(paginatedComments);
  };
}
