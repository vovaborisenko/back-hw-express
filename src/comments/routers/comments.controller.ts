import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { createDeleteCommentHandler } from './handlers/delete-comment.handler';
import { createGetCommentHandler } from './handlers/get-comment.handler';
import { createUpdateCommentHandler } from './handlers/update-comment.handler';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsController {
  readonly deleteItem;
  readonly getItem;
  readonly updateItem;

  constructor(
    @inject(CommentsService) private readonly commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {
    this.deleteItem = createDeleteCommentHandler(this.commentsService);
    this.getItem = createGetCommentHandler(this.commentsQueryRepository);
    this.updateItem = createUpdateCommentHandler(this.commentsService);
  }
}
