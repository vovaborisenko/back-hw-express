import { LikeStatus } from '../../likes/types/like';

interface LikeViewModel {
  addedAt: string;
  userId: string;
  login: string;
}

interface LikesViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Partial<LikeViewModel>[];
}

export interface PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string | null;
  createdAt: string;
  extendedLikesInfo: LikesViewModel;
}
