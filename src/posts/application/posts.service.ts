import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { PostsRepository } from '../repositories/posts.repository';
import { PostCreateDto } from '../dto/post.create-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { PostUpdateDto } from '../dto/post.update-dto';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostModel } from '../models/post.model';
import { Result } from '../../core/types/result-object';
import { PostLikeStatusUpdateDto } from '../dto/post-like-status.update-dto';
import { LikeService } from '../../likes/application/like.service';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
    @inject(LikeService) private readonly likesService: LikeService,
  ) {}

  async create(dto: PostCreateDto): Promise<Types.ObjectId> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    const postDocument = new PostModel();

    postDocument.title = dto.title;
    postDocument.shortDescription = dto.shortDescription;
    postDocument.content = dto.content;
    postDocument.blog = blog._id;

    await this.postsRepository.save(postDocument);

    return postDocument._id;
  }

  async update(id: string, dto: PostUpdateDto): Promise<void> {
    const postDocument = await this.postsRepository.findById(id);

    if (!postDocument) {
      throw new NotExistError('Post');
    }

    Object.assign(postDocument, dto);

    await this.postsRepository.save(postDocument);
  }

  async updateLikeStatus(
    id: string,
    userId: string,
    dto: PostLikeStatusUpdateDto,
  ): Promise<Result<Types.ObjectId>> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotExistError('Post');
    }

    return this.likesService.updateOrCreate({
      status: dto.likeStatus,
      authorId: new Types.ObjectId(userId),
      parentId: post._id,
    });
  }

  delete(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }
}
