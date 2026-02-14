import { ObjectId, WithId } from 'mongodb';
import { Comment } from '../types/comment';
import { commentCollection } from '../../db/mongo.db';
import { CommentUpdateDto } from '../dto/comment.update-dto';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepository {
  async create(comment: Comment): Promise<string> {
    const insertResult = await commentCollection.insertOne(comment);

    return insertResult.insertedId.toString();
  }

  async update(id: string, dto: CommentUpdateDto): Promise<boolean> {
    const updateResult = await commentCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          content: dto.content,
        },
      },
    );

    return updateResult.matchedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await commentCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount > 0;
  }

  findById(id: string): Promise<WithId<Comment> | null> {
    return commentCollection.findOne({
      _id: new ObjectId(id),
    });
  }
}
