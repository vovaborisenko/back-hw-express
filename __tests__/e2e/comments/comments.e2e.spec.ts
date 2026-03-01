import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { invalidAuth, validMongoId } from '../constants/common';
import {
  commentDto,
  createComment,
  createComments,
} from '../utils/comment/comment.util';
import { createUserAndLogin, userDto } from '../utils/user/user.util';
import { LikeStatus } from '../../../src/likes/types/like';

describe('Comments API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
  });

  afterAll(async () => {
    await stopDb();
  });

  beforeEach(async () => {
    await request(app)
      .delete(PATH.TESTING_ALL_DATA)
      .expect(HttpStatus.NoContent);
  });

  it.each`
    path                                 | method
    ${PATH.COMMENTS + '/12'}             | ${'put'}
    ${PATH.COMMENTS + '/12/like-status'} | ${'put'}
    ${PATH.COMMENTS + '/12'}             | ${'delete'}
  `(
    'should return 401 when invalid header Authorization: [$method] $path',
    async ({ path, method }: { path: string; method: 'put' | 'delete' }) => {
      await request(app)[method](path).expect(HttpStatus.Unauthorized);
      await request(app)
        [method](path)
        .set('Authorization', `Bearer ${invalidAuth}`)
        .expect(HttpStatus.Unauthorized);
    },
  );

  describe(`GET ${PATH.COMMENTS}/:id`, () => {
    it('should return 404 when no comment', async () => {
      await request(app)
        .get(`${PATH.COMMENTS}/${validMongoId}`)
        .expect(HttpStatus.NotFound);
    });

    it('should return comment with requested id', async () => {
      const [comment] = await createComment(app);

      const response = await request(app)
        .get(`${PATH.COMMENTS}/${comment.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual(comment);
    });
  });

  describe(`PUT ${PATH.COMMENTS}/:id`, () => {
    it('should return 404 when no comment', async () => {
      const { token } = await createUserAndLogin(app);
      await request(app)
        .put(`${PATH.COMMENTS}/${validMongoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.update)
        .expect(HttpStatus.NotFound);
    });

    it('should return 403 when user is not owner of comment', async () => {
      const [comment] = await createComment(app);
      const { token } = await createUserAndLogin(app, userDto.create[1]);
      await request(app)
        .put(`${PATH.COMMENTS}/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.update)
        .expect(HttpStatus.Forbidden);
    });

    it('should return 204 when requested id exist', async () => {
      const [comment, , token] = await createComment(app);

      await request(app)
        .put(`${PATH.COMMENTS}/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.update)
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${PATH.COMMENTS}/${comment.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual({ ...comment, ...commentDto.update });
    });
  });

  describe(`PUT ${PATH.COMMENTS}/:id/like-status`, () => {
    it('should return 404 when no comment', async () => {
      const { token } = await createUserAndLogin(app);
      await request(app)
        .put(`${PATH.COMMENTS}/${validMongoId}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.updateLikeStatus[0])
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const [comment, , token] = await createComment(app);

      await request(app)
        .put(`${PATH.COMMENTS}/${comment.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.updateLikeStatus[0])
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${PATH.COMMENTS}/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        ...comment,
        likesInfo: {
          ...comment.likesInfo,
          likesCount: comment.likesInfo.likesCount + 1,
          myStatus: LikeStatus.Like,
        },
      });

      await request(app)
        .put(`${PATH.COMMENTS}/${comment.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.updateLikeStatus[1])
        .expect(HttpStatus.NoContent);

      const responseAfterDislike = await request(app)
        .get(`${PATH.COMMENTS}/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Ok);

      expect(responseAfterDislike.body).toEqual({
        ...comment,
        likesInfo: {
          ...comment.likesInfo,
          dislikesCount: comment.likesInfo.dislikesCount + 1,
          myStatus: LikeStatus.Dislike,
        },
      });
    });

    it('should update likes', async () => {
      const [comments, , token] = await createComments(4, app);

      // set likes
      for (let i = 0; i < comments.length; i++) {
        await request(app)
          .put(`${PATH.COMMENTS}/${comments[i].id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentDto.updateLikeStatus[0])
          .expect(HttpStatus.NoContent);

        const response = await request(app)
          .get(`${PATH.COMMENTS}/${comments[i].id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.Ok);

        expect(response.body.likesInfo).toEqual({
          ...comments[i].likesInfo,
          likesCount: 1,
          myStatus: LikeStatus.Like,
        });

        const responseUnauth = await request(app)
          .get(`${PATH.COMMENTS}/${comments[i].id}`)
          .expect(HttpStatus.Ok);

        expect(responseUnauth.body.likesInfo).toEqual({
          ...comments[i].likesInfo,
          likesCount: 1,
          myStatus: LikeStatus.None,
        });
      }
      // set dislikes
      for (let i = 0; i < comments.length; i++) {
        await request(app)
          .put(`${PATH.COMMENTS}/${comments[i].id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentDto.updateLikeStatus[1])
          .expect(HttpStatus.NoContent);

        const response = await request(app)
          .get(`${PATH.COMMENTS}/${comments[i].id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.Ok);

        expect(response.body.likesInfo).toEqual({
          ...comments[i].likesInfo,
          dislikesCount: 1,
          myStatus: LikeStatus.Dislike,
        });

        const responseUnauth = await request(app)
          .get(`${PATH.COMMENTS}/${comments[i].id}`)
          .expect(HttpStatus.Ok);

        expect(responseUnauth.body.likesInfo).toEqual({
          ...comments[i].likesInfo,
          dislikesCount: 1,
          myStatus: LikeStatus.None,
        });
      }
      // set none
      for (let i = 3; i < comments.length; i++) {
        await request(app)
          .put(`${PATH.COMMENTS}/${comments[i].id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentDto.updateLikeStatus[2])
          .expect(HttpStatus.NoContent);

        const response = await request(app)
          .get(`${PATH.COMMENTS}/${comments[i].id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.Ok);

        expect(response.body.likesInfo).toEqual({
          ...comments[i].likesInfo,
          myStatus: LikeStatus.None,
        });

        const responseUnauth = await request(app)
          .get(`${PATH.COMMENTS}/${comments[i].id}`)
          .expect(HttpStatus.Ok);

        expect(responseUnauth.body.likesInfo).toEqual({
          ...comments[i].likesInfo,
          myStatus: LikeStatus.None,
        });
      }
    });
  });

  describe(`DELETE ${PATH.COMMENTS}/:id`, () => {
    it('should return 404 when no comment', async () => {
      const { token } = await createUserAndLogin(app);
      await request(app)
        .delete(`${PATH.COMMENTS}/${validMongoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NotFound);
    });

    it('should return 403 when user is not owner of comment', async () => {
      const [comment] = await createComment(app);
      const { token } = await createUserAndLogin(app, userDto.create[1]);
      await request(app)
        .delete(`${PATH.COMMENTS}/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Forbidden);
    });

    it('should return 204 when requested id exist', async () => {
      const [comment, , token] = await createComment(app);

      await request(app)
        .delete(`${PATH.COMMENTS}/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NoContent);
      await request(app)
        .get(`${PATH.COMMENTS}/${comment.id}`)
        .expect(HttpStatus.NotFound);
    });
  });
});
