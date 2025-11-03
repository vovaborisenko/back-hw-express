import { ObjectId } from 'mongodb';

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
}

export interface AggregatedPost extends Post {
  blogName: string | null;
  createdAt: Date;
}
