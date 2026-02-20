import { LikeStatus } from '../../likes/types/like';

interface Commentator {
  userId: string;
  userLogin: string | null;
}

interface LikeViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export interface CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: Commentator;
  createdAt: string;
  likesInfo: LikeViewModel;
}
