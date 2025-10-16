import { Blog } from '../types/blogs';
import { db } from '../../db/in-memory.db';
import { BlogUpdateDto } from '../dto/blog.update-dto';
import { HttpStatus } from '../../core/types/http-status';

export const blogsRepositiry = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(blogID: string): Blog | null {
    return db.blogs.find(({ id }) => id === blogID) ?? null;
  },

  create(blog: Blog): Blog {
    db.blogs.push(blog);

    return blog;
  },

  update(blogID: string, dto: BlogUpdateDto): void {
    const blog = db.blogs.find(({ id }) => id === blogID);

    if (!blog) {
      throw new Error('Blog not exist');
    }

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
  },

  delete(blogID: string): void {
    const index = db.blogs.findIndex(({ id }) => id === blogID);

    if (index === -1) {
      throw new Error('Blog not exist');
    }

    db.blogs.splice(index, 1);
  },
};
