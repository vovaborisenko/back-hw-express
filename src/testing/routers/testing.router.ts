import { Router, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-status';
import { SecurityDeviceModel } from '../../security-devices/models/security-device.model';
import { UserModel } from '../../users/models/user.model';
import { LogModel } from '../../logs/models/log.model';
import { BlogModel } from '../../blogs/models/blog.model';
import { PostModel } from '../../posts/models/post.model';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all(
    [
      BlogModel,
      // commentCollection,
      SecurityDeviceModel,
      LogModel,
      PostModel,
      UserModel,
    ].map((collection) => collection.deleteMany()),
  );
  res.sendStatus(HttpStatus.NoContent);
});
