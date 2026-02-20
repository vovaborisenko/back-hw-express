import { body } from 'express-validator';
import { LikeStatus } from '../../likes/types/like';

const LikeStatuses = Object.values(LikeStatus);

export const commentLikeStatusUpdateDtoValidationMiddleware = [
  body('likeStatus')
    .isString()
    .withMessage(`likeStatus should be string`)
    .trim()
    .isIn(LikeStatuses)
    .withMessage(`Should be on of ${LikeStatuses.join(', ')}`),
];
