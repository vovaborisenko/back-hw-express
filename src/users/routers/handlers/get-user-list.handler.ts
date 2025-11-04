import { Request, Response } from 'express';
import { mapToUserViewModel } from '../mappers/map-to-user-view-model';

export function getUserListHandler(req: Request, res: Response): void {
  res.send({
    pageCount: 0,
    page: 0,
    pageSize: 0,
    totalCount: 0,
    items: [].map(mapToUserViewModel),
  });
}
