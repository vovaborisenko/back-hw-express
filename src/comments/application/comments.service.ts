import { CommentCreateDto } from '../dto/comment.create-dto';
import { CommentUpdateDto } from '../dto/comment.update-dto';
import { CommentsRepository } from '../repositories/comments.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { Result, ResultStatus } from '../../core/types/result-object';

export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(
    dto: CommentCreateDto,
    postId: string,
    userId: string,
  ): Promise<Result<string> | Result<null, ResultStatus.NotFound>> {
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

    const newComment = {
      content: dto.content,
      userId: user._id,
      postId: post._id,
      createdAt: new Date(),
    };

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: await this.commentsRepository.create(newComment),
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

    if (userId !== comment.userId.toString()) {
      return {
        status: ResultStatus.Forbidden,
        extensions: [],
        data: null,
      };
    }

    const isSuccess = await this.commentsRepository.update(id, dto);

    return {
      status: isSuccess ? ResultStatus.Success : ResultStatus.NotFound,
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

    if (userId !== comment.userId.toString()) {
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
