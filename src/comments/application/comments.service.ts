import { CommentCreateDto } from '../dto/comment.create-dto';
import { CommentUpdateDto } from '../dto/comment.update-dto';
import { CommentsRepository } from '../repositories/comments.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { Result, ResultStatus } from '../../core/types/result-object';
import { inject, injectable } from 'inversify';
import { CommentModel } from '../models/comment.model';
import { Types } from 'mongoose';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async create(
    dto: CommentCreateDto,
    postId: string,
    userId: string,
  ): Promise<Result<Types.ObjectId> | Result<null, ResultStatus.NotFound>> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: 'userId', message: 'User not found' }],
        data: null,
      };
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: 'postId', message: 'Post not found' }],
        data: null,
      };
    }

    const commentDocument = new CommentModel();

    commentDocument.content = dto.content;
    commentDocument.user = user._id;
    commentDocument.post = post._id;

    await this.commentsRepository.save(commentDocument);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: commentDocument._id,
    };
  }

  async update(
    id: string,
    userId: string,
    dto: CommentUpdateDto,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.NotFound | ResultStatus.Forbidden
    >
  > {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        extensions: [],
        data: null,
      };
    }

    if (userId !== comment.user.toString()) {
      return {
        status: ResultStatus.Forbidden,
        extensions: [],
        data: null,
      };
    }

    Object.assign(comment, dto);

    await this.commentsRepository.save(comment);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.NotFound | ResultStatus.Forbidden
    >
  > {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        extensions: [],
        data: null,
      };
    }

    if (userId !== comment.user.toString()) {
      return {
        status: ResultStatus.Forbidden,
        extensions: [],
        data: null,
      };
    }

    const isSuccess = await this.commentsRepository.delete(id);

    return {
      status: isSuccess ? ResultStatus.Success : ResultStatus.NotFound,
      extensions: [],
      data: null,
    };
  }
}
