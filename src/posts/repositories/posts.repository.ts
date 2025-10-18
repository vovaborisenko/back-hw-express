import { PostBase } from '../types/posts';
import { db } from '../../db/in-memory.db';
import { PostUpdateDto } from '../dto/post.update-dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { NotExistError } from '../../core/errors/not-exist.error';

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
      throw new NotExistError('Post');
    }

    const blog = blogsRepository.findById(post.blogId);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
  },

  delete(postID: string): void {
    const index = db.posts.findIndex(({ id }) => id === postID);

    if (index === -1) {
      throw new NotExistError('Post');
    }

    db.posts.splice(index, 1);
  },
};
