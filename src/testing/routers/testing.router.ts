import { Router, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-status';
import {
  blogCollection,
  commentCollection,
  logCollection,
  postCollection,
  securityDeviceCollection,
  userCollection,
} from '../../db/mongo.db';
import { SecurityDeviceModel } from '../../security-devices/models/security-device.model';
import { UserModel } from '../../users/models/user.model';
import { LogModel } from '../../logs/models/log.model';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all(
    [
      // blogCollection,
      // commentCollection,
      SecurityDeviceModel,
      LogModel,
      // postCollection,
      UserModel,
    ].map((collection) => collection.deleteMany()),
  );
  res.sendStatus(HttpStatus.NoContent);
});
