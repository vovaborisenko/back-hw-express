export interface PostBase {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface Post extends PostBase {
  blogName: string | null;
}
