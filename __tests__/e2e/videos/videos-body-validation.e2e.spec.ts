import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { VideoCreateDto } from '../../../src/videos/dto/video.create-dto';
import { Resolution } from '../../../src/videos/types/videos';
import { VideoUpdateDto } from '../../../src/videos/dto/video.update-dto';

describe('Videos API body validation', () => {
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
    it.each`
      field                     | value                         | message
      ${'title'}                | ${null}                       | ${'Invalid string'}
      ${'title'}                | ${5}                          | ${'Invalid string'}
      ${'title'}                | ${''}                         | ${'Required value'}
      ${'title'}                | ${'    '}                     | ${'Required value'}
      ${'title'}                | ${'4'.repeat(41)}             | ${'Max length 40'}
      ${'author'}               | ${null}                       | ${'Invalid string'}
      ${'author'}               | ${5}                          | ${'Invalid string'}
      ${'author'}               | ${''}                         | ${'Required value'}
      ${'author'}               | ${'    '}                     | ${'Required value'}
      ${'author'}               | ${'4'.repeat(21)}             | ${'Max length 20'}
      ${'availableResolutions'} | ${null}                       | ${'Invalid value'}
      ${'availableResolutions'} | ${{}}                         | ${'Invalid value'}
      ${'availableResolutions'} | ${'sadw'}                     | ${'Invalid value'}
      ${'availableResolutions'} | ${[]}                         | ${'Required value'}
      ${'availableResolutions'} | ${['zsac']}                   | ${'Impossible resolution: zsac'}
      ${'availableResolutions'} | ${[Resolution.P1080, 'fail']} | ${'Impossible resolution: fail'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post('/videos')
          .send({ ...newVideo, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe('PUT videos/:id', () => {
    it.each`
      field                     | value                         | message
      ${'title'}                | ${null}                       | ${'Invalid string'}
      ${'title'}                | ${5}                          | ${'Invalid string'}
      ${'title'}                | ${''}                         | ${'Required value'}
      ${'title'}                | ${'    '}                     | ${'Required value'}
      ${'title'}                | ${'4'.repeat(41)}             | ${'Max length 40'}
      ${'author'}               | ${null}                       | ${'Invalid string'}
      ${'author'}               | ${5}                          | ${'Invalid string'}
      ${'author'}               | ${''}                         | ${'Required value'}
      ${'author'}               | ${'    '}                     | ${'Required value'}
      ${'author'}               | ${'4'.repeat(21)}             | ${'Max length 20'}
      ${'availableResolutions'} | ${null}                       | ${'Invalid value'}
      ${'availableResolutions'} | ${{}}                         | ${'Invalid value'}
      ${'availableResolutions'} | ${'sadw'}                     | ${'Invalid value'}
      ${'availableResolutions'} | ${[]}                         | ${'Required value'}
      ${'availableResolutions'} | ${['zsac']}                   | ${'Impossible resolution: zsac'}
      ${'availableResolutions'} | ${[Resolution.P1080, 'fail']} | ${'Impossible resolution: fail'}
      ${'canBeDownloaded'}      | ${'null'}                     | ${'Invalid boolean'}
      ${'canBeDownloaded'}      | ${null}                       | ${'Invalid boolean'}
      ${'canBeDownloaded'}      | ${0}                          | ${'Invalid boolean'}
      ${'canBeDownloaded'}      | ${[]}                         | ${'Invalid boolean'}
      ${'minAgeRestriction'}    | ${'null'}                     | ${'Invalid number'}
      ${'minAgeRestriction'}    | ${0}                          | ${'Min 1'}
      ${'minAgeRestriction'}    | ${19}                         | ${'Max 18'}
      ${'publicationDate'}      | ${null}                       | ${'Invalid date'}
      ${'publicationDate'}      | ${12}                         | ${'Invalid date'}
      ${'publicationDate'}      | ${'12'}                       | ${'Invalid date'}
      ${'publicationDate'}      | ${'2026-10-10T19:10:77.909Z'} | ${'Invalid date'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const { body: video } = await request(app)
          .post('/videos')
          .send(newVideo)
          .expect(HttpStatus.Created);

        const response = await request(app)
          .put(`/videos/${video.id}`)
          .send({ ...updatedVideo, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });
});
