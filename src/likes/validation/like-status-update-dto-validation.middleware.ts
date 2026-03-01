import { body } from 'express-validator';
import { LikeStatus } from '../types/like';

const LikeStatuses = Object.values(LikeStatus);

export const likeStatusUpdateDtoValidationMiddleware = [
  body('likeStatus')
    .isString()
    .withMessage(`likeStatus should be string`)
    .trim()
    .isIn(LikeStatuses)
    .withMessage(`Should be on of ${LikeStatuses.join(', ')}`),
];
