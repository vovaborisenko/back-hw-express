import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Comment } from '../comments/types/comment';
import { Post } from '../posts/types/post';
import { User } from '../users/types/user';
import { SETTINGS } from '../core/settings/settings';
import { RefreshToken } from '../auth/types/refresh-token';

export const BLOG_COLLECTION_NAME = 'blogs';
const COMMENTS_COLLECTION_NAME = 'comments';
const POST_COLLECTION_NAME = 'posts';
const REFRESH_TOKEN_COLLECTION_NAME = 'refreshToken';
export const USER_COLLECTION_NAME = 'users';

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let commentCollection: Collection<Comment>;
export let postCollection: Collection<Post>;
export let refreshTokenCollection: Collection<RefreshToken>;
export let userCollection: Collection<User>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //Инициализация коллекций
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  refreshTokenCollection = db.collection<RefreshToken>(
    REFRESH_TOKEN_COLLECTION_NAME,
  );
  userCollection = db.collection<User>(USER_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
  console.log('✅ DB Stopped');
}
