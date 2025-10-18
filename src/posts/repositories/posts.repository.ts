import { PostBase } from '../types/posts';
import { db } from '../../db/in-memory.db';
import { PostUpdateDto } from '../dto/post.update-dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postsRepository = {
  findAll(): PostBase[] {
    return db.posts;
  },

  findById(postID: string): PostBase | null {
    return db.posts.find(({ id }) => id === postID) ?? null;
  },

  create(post: PostBase): PostBase {
    db.posts.push(post);

    return post;
  },

  update(postID: string, dto: PostUpdateDto): void {
    const post = db.posts.find(({ id }) => id === postID);

    if (!post) {
      throw new Error('Post not exist');
    }

    const blog = blogsRepository.findById(post.blogId);

    if (!blog) {
      throw new Error('Blog not exist');
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
  },

  delete(postID: string): void {
    const index = db.posts.findIndex(({ id }) => id === postID);

    if (index === -1) {
      throw new Error('Post not exist');
    }

    db.posts.splice(index, 1);
  },
};
