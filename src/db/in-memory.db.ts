import { Blog } from '../blogs/types/blogs';

export const db = {
  blogs: <Blog[]>[
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'Tech Insights',
      description: 'Latest news and trends in technology world',
      websiteUrl: 'https://tech-insights.blog.com',
    },
    {
      id: 'b2c3d4e5-f6a7-890b-cdef-234567890123',
      name: 'Web Development Guide',
      description: 'Helpful articles and tutorials on web development',
      websiteUrl: 'https://webdev-guide.dev',
    },
    {
      id: 'c3d4e5f6-a7b8-901c-def2-345678901234',
      name: 'JavaScript Mastery',
      description: 'Learning JavaScript and modern frameworks',
      websiteUrl: 'https://js-mastery.org',
    },
  ],
  posts: <Blog[]>[],
};
