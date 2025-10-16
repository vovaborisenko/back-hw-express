import { Resolution, Video } from '../videos/types/videos';

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: 'Introduction to TypeScript',
      author: 'John Developer',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: '2024-01-15T10:30:00.000Z',
      publicationDate: '2024-01-20T08:00:00.000Z',
      availableResolutions: [
        Resolution.P720,
        Resolution.P1080,
        Resolution.P1440,
      ],
    },
    {
      id: 2,
      title: 'Advanced JavaScript Patterns',
      author: 'Sarah Coder',
      canBeDownloaded: false,
      minAgeRestriction: 16,
      createdAt: '2024-01-10T14:20:00.000Z',
      publicationDate: '2024-01-25T12:00:00.000Z',
      availableResolutions: [
        Resolution.P144,
        Resolution.P360,
        Resolution.P480,
        Resolution.P720,
      ],
    },
    {
      id: 3,
      title: 'Web Development Fundamentals',
      author: 'Mike Tech',
      canBeDownloaded: true,
      minAgeRestriction: 12,
      createdAt: '2024-01-05T09:15:00.000Z',
      publicationDate: '2024-01-18T15:30:00.000Z',
      availableResolutions: [
        Resolution.P1080,
        Resolution.P1440,
        Resolution.P2160,
      ],
    },
  ],
};
