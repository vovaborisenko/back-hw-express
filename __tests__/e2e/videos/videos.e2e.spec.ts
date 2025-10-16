import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { VideoCreateDto } from '../../../src/videos/dto/video.create-dto';
import { Resolution } from '../../../src/videos/types/videos';
import { VideoUpdateDto } from '../../../src/videos/dto/video.update-dto';

describe('Videos API', () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
  });

  const newVideo: VideoCreateDto = {
    title: 'test title',
    author: 'test author',
    availableResolutions: [Resolution.P144],
  };

  const updatedVideo: VideoUpdateDto = {
    title: 'test updated title',
    author: 'test updated author',
    availableResolutions: [Resolution.P360, Resolution.P1080],
    canBeDownloaded: true,
    minAgeRestriction: 18,
    publicationDate: '2026-10-10T19:10:37.909Z',
  };

  describe('POST videos', () => {
    it('should create', async () => {
      const response = await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);

      expect(response.body).toMatchObject(newVideo);
    });
  });

  describe('GET videos', () => {
    it('should return [] when no videos', async () => {
      const response = await request(app).get('/videos').expect(HttpStatus.Ok);

      expect(response.body).toEqual([]);
    });

    it('should return list of videos', async () => {
      await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);
      await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);

      const response = await request(app).get('/videos').expect(HttpStatus.Ok);

      expect(response.body.length).toBe(2);
    });
  });

  describe('GET videos/:id', () => {
    it('should return 404 when no video', async () => {
      await request(app).get('/videos/987').expect(HttpStatus.NotFound);
    });

    it('should return video with requested id', async () => {
      await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);
      const { body: video2 } = await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);

      const response = await request(app)
        .get(`/videos/${video2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual(video2);
    });
  });

  describe('PUT videos/:id', () => {
    it('should return 404 when no video', async () => {
      await request(app).put('/videos/987').expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const { body: video1 } = await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);
      const { body: video2 } = await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);

      await request(app)
        .put(`/videos/${video1.id}`)
        .send({ ...updatedVideo, minAgeRestriction: null })
        .expect(HttpStatus.NoContent);
      await request(app)
        .put(`/videos/${video2.id}`)
        .send(updatedVideo)
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`/videos/${video2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toMatchObject(updatedVideo);
    });
  });

  describe('DELETE videos/:id', () => {
    it('should return 404 when no video', async () => {
      await request(app).delete('/videos/987').expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);
      const { body: video2 } = await request(app)
        .post('/videos')
        .send(newVideo)
        .expect(HttpStatus.Created);

      await request(app)
        .delete(`/videos/${video2.id}`)
        .expect(HttpStatus.NoContent);
    });
  });
});
