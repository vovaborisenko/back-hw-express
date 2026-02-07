import express from 'express';
import jws from 'jsonwebtoken';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { validAuth } from '../constants/common';
import { createUserAndLogin } from '../utils/user/user.util';
import { extractCookies } from '../utils/cookies/cookies';
import { wait } from '../utils/core/wait';

describe('Auth API', () => {
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

  describe(`POST ${PATH.AUTH}/login`, () => {
    it('should return 401 if login or password is wrong', async () => {
      await request(app)
        .post(`${PATH.AUTH}/login`)
        .send({
          loginOrEmail: 'loginOrEmail',
          password: 'password',
        })
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200, refreshToken and accessToken when credentials is right', async () => {
      const { user, token, refreshToken } = await createUserAndLogin(app);

      // @ts-ignore
      expect(jws.decode(token)?.userId).toBe(user.id);
      // @ts-ignore
      expect(jws.decode(refreshToken)?.userId).toBe(user.id);
    });
  });

  describe(`GET ${PATH.AUTH}/me`, () => {
    it('should return 401 if accessToken is not exist', async () => {
      await request(app).get(`${PATH.AUTH}/me`).expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if accessToken is wrong', async () => {
      await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', 'Bearer accessToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if accessToken is right but user is deleted', async () => {
      const { user, token } = await createUserAndLogin(app);

      await request(app)
        .delete(`${PATH.USERS}/${user.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);

      await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200 and me view model if accessToken is correct', async () => {
      const { user, token } = await createUserAndLogin(app);

      const { body: me } = await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Ok);

      expect(me).toEqual({
        userId: user.id,
        login: user.login,
        email: user.email,
      });
    });
  });

  describe(`POST ${PATH.AUTH}/refresh-token`, () => {
    it('should return 401 if refreshToken is not exist', async () => {
      await request(app)
        .post(`${PATH.AUTH}/refresh-token`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if refreshToken is wrong', async () => {
      await request(app)
        .post(`${PATH.AUTH}/refresh-token`)
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200 and new tokens if refreshToken is correct', async () => {
      const { user, refreshToken, token } = await createUserAndLogin(app);

      await wait(1000);

      const response = await request(app)
        .post(`${PATH.AUTH}/refresh-token`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Ok);

      const cookies = extractCookies(response);

      expect(response.body.accessToken).not.toBe(token);
      expect(cookies.refreshToken).not.toBe(refreshToken);
      // @ts-ignore
      expect(jws.decode(response.body.accessToken)?.userId).toBe(user.id);
      // @ts-ignore
      expect(jws.decode(cookies.refreshToken)?.userId).toBe(user.id);
    });

    it('should return 401 on second request with the same token', async () => {
      const { refreshToken } = await createUserAndLogin(app);

      await wait(1000);

      await request(app)
        .post(`${PATH.AUTH}/refresh-token`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Ok);
      await request(app)
        .post(`${PATH.AUTH}/refresh-token`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Unauthorized);
    });
  });

  describe(`POST ${PATH.AUTH}/logout`, () => {
    it('should return 401 if refreshToken is not exist', async () => {
      await request(app)
        .post(`${PATH.AUTH}/logout`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if refreshToken is wrong', async () => {
      await request(app)
        .post(`${PATH.AUTH}/logout`)
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 204 refreshToken is correct', async () => {
      const { refreshToken } = await createUserAndLogin(app);

      await request(app)
        .post(`${PATH.AUTH}/logout`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.NoContent);
    });

    it('should return 401 on second request', async () => {
      const { refreshToken } = await createUserAndLogin(app);

      await request(app)
        .post(`${PATH.AUTH}/logout`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.NoContent);
      await request(app)
        .post(`${PATH.AUTH}/logout`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Unauthorized);
    });
  });

  describe(`POST ${PATH.AUTH}/registration-confirmation`, () => {
    it('should return 400 if code not exist', async () => {
      await request(app)
        .post(`${PATH.AUTH}/registration-confirmation`)
        .send({
          code: 'loginOrEmail',
        })
        .expect(HttpStatus.BadRequest);
    });

    it('should return 200 and accessToken when credentials is right', async () => {
      const { user, token } = await createUserAndLogin(app);

      // @ts-ignore
      expect(jws.decode(token)?.userId).toBe(user.id);
    });
  });

  describe(`Too many attempts`, () => {
    beforeAll(() => {
      jest.useFakeTimers({ advanceTimers: true });
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it.each`
      path                              | maxAttempts
      ${'login'}                        | ${5}
      ${'registration'}                 | ${5}
      ${'registration-confirmation'}    | ${5}
      ${'registration-email-resending'} | ${5}
    `(
      `should return 429 POST ${PATH.AUTH}/$path more than $maxAttempts attempts`,
      async ({ path, maxAttempts }) => {
        await runTest();

        // after 10sec has more attempts
        jest.setSystemTime(Date.now() + 1e4);
        await runTest();

        async function runTest() {
          for (let i = 1; i <= maxAttempts + 1; i++) {
            await request(app)
              .post(`${PATH.AUTH}/${path}`)
              .send()
              .expect(
                i > maxAttempts
                  ? HttpStatus.TooManyRequests
                  : HttpStatus.BadRequest,
              );
          }
        }
      },
    );
  });
});
