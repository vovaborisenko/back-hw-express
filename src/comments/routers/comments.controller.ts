import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { createDeleteCommentHandler } from './handlers/delete-comment.handler';
import { createGetCommentHandler } from './handlers/get-comment.handler';
import { createUpdateCommentHandler } from './handlers/update-comment.handler';

export class CommentsController {
  readonly deleteItem;
  readonly getItem;
  readonly updateItem;

  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {
    this.deleteItem = createDeleteCommentHandler(this.commentsService);
    this.getItem = createGetCommentHandler(this.commentsQueryRepository);
    this.updateItem = createUpdateCommentHandler(this.commentsService);
  }
}
