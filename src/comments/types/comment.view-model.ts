interface Commentator {
  userId: string;
  userLogin: string | null;
}

export interface CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: Commentator;
  createdAt: string;
}
