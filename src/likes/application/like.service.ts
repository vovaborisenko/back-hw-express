import { Result, ResultStatus } from '../../core/types/result-object';
import { LikeRepository } from '../repositiories/like.repository';
import { inject, injectable } from 'inversify';
import { LikeModel } from '../models/like.model';
import { LikeCreateDto } from '../dto/like.create-dto';
import { Types } from 'mongoose';

@injectable()
export class LikeService {
  constructor(
    @inject(LikeRepository) private readonly likeRepository: LikeRepository,
  ) {}

  async create(dto: LikeCreateDto): Promise<Result<Types.ObjectId>> {
    const likeDoc = new LikeModel();

    likeDoc.status = dto.status;
    likeDoc.author = dto.authorId;
    likeDoc.parent = dto.parentId;

    await this.likeRepository.save(likeDoc);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: likeDoc._id,
    };
  }

  async update(
    dto: LikeCreateDto,
  ): Promise<Result<Types.ObjectId> | Result<null, ResultStatus.NotFound>> {
    const likeDoc = await LikeModel.findOne({
      parent: dto.parentId,
      author: dto.authorId,
    });

    if (!likeDoc) {
      return {
        status: ResultStatus.NotFound,
        extensions: [],
        data: null,
      };
    }

    likeDoc.status = dto.status;

    await this.likeRepository.save(likeDoc);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: likeDoc._id,
    };
  }

  async updateOrCreate(dto: LikeCreateDto): Promise<Result<Types.ObjectId>> {
    const result = await this.update(dto);

    if (result.status === ResultStatus.Success) {
      return result;
    }

    return this.create(dto);
  }
}
