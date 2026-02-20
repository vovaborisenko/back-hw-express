import { Router } from 'express';
import { HttpStatus } from '../../core/types/http-status';
import { SecurityDeviceModel } from '../../security-devices/models/security-device.model';
import { UserModel } from '../../users/models/user.model';
import { LogModel } from '../../logs/models/log.model';
import { BlogModel } from '../../blogs/models/blog.model';
import { PostModel } from '../../posts/models/post.model';
import { CommentModel } from '../../comments/models/comment.model';

export const testingRouter = Router({});

testingRouter.delete<'/all-data', {}, undefined, undefined>(
  '/all-data',
  async (_req, res) => {
    await Promise.all(
      [
        BlogModel,
        CommentModel,
        SecurityDeviceModel,
        LogModel,
        PostModel,
        UserModel,
      ].map((collection) => collection.deleteMany()),
    );
    res.sendStatus(HttpStatus.NoContent);
  },
);
