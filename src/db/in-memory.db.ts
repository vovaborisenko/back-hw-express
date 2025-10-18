import { Blog } from '../blogs/types/blogs';
import { PostBase } from '../posts/types/posts';

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
  posts: <PostBase[]>[
    {
      id: 'p1a2b3c4-d5e6-7890-f1g2-h3i4j5k6l7m8',
      title: 'Новые возможности TypeScript 5.0',
      shortDescription: 'Обзор новых фич и улучшений в TypeScript',
      content:
        'TypeScript 5.0 представляет множество улучшений производительности и новые возможности...',
      blogId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    {
      id: 'p2b3c4d5-e6f7-8901-g2h3-i4j5k6l7m8n9',
      title: 'React 18: Что нового?',
      shortDescription: 'Знакомство с новыми возможностями React 18',
      content:
        'React 18 приносит революционные изменения в рендеринг приложений...',
      blogId: 'b2c3d4e5-f6a7-890b-cdef-234567890123',
    },
    {
      id: 'p3c4d5e6-f7g8-9012-h3i4-j5k6l7m8n9o0',
      title: 'Асинхронность в JavaScript',
      shortDescription: 'Полное руководство по async/await и Promise',
      content:
        'Понимание асинхронности - ключевой навык для JavaScript разработчика...',
      blogId: 'c3d4e5f6-a7b8-901c-def2-345678901234',
    },
  ],
};
