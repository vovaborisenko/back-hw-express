import express from 'express';
import jws from 'jsonwebtoken';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { validAuth } from '../constants/common';
import {
  createUser,
  createUserAndLogin,
  loginUser,
  loginUserWithDifferentUserAgent,
  USER_AGENTS,
  userDto,
} from '../utils/user/user.util';
import { extractCookies } from '../utils/cookies/cookies';
import { wait } from '../utils/core/wait';

describe('Security Devices API', () => {
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

  describe(`GET ${PATH.SECURITY_DEVICES}`, () => {
    it('should return 401 if no refresh token', async () => {
      await request(app)
        .get(PATH.SECURITY_DEVICES)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if refreshToken is wrong', async () => {
      await request(app)
        .get(PATH.SECURITY_DEVICES)
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200 and deviceId is the same if refreshToken is right', async () => {
      const { refreshToken } = await createUserAndLogin(app);

      const response = await request(app)
        .get(PATH.SECURITY_DEVICES)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Ok);

      expect(response.body.length).toBe(1);
      // @ts-ignore
      expect(jws.decode(refreshToken)?.deviceId).toBe(
        response.body[0].deviceId,
      );
    });

    it('should return all users devices', async () => {
      await createUser(app, userDto.create[0]);
      const [{ refreshToken }] = await loginUserWithDifferentUserAgent(
        5,
        app,
        userDto.create[0],
      );

      const { body } = await request(app)
        .get(PATH.SECURITY_DEVICES)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Ok);

      expect(body.length).toBe(5);
    });
  });

  describe(`DELETE ${PATH.SECURITY_DEVICES}`, () => {
    it('should return 401 if no refresh token', async () => {
      await request(app)
        .delete(PATH.SECURITY_DEVICES)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if refreshToken is wrong', async () => {
      await request(app)
        .delete(PATH.SECURITY_DEVICES)
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 204 if refreshToken is right', async () => {
      const { refreshToken } = await createUserAndLogin(app);

      await request(app)
        .delete(PATH.SECURITY_DEVICES)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.NoContent);
    });

    it('should delete all users devices, except current', async () => {
      await createUser(app, userDto.create[0]);
      const [{ refreshToken }] = await loginUserWithDifferentUserAgent(
        5,
        app,
        userDto.create[0],
      );

      await request(app)
        .delete(PATH.SECURITY_DEVICES)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.NoContent);

      const { body } = await request(app)
        .get(PATH.SECURITY_DEVICES)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.Ok);

      expect(body.length).toBe(1);
    });
  });

  describe(`DELETE ${PATH.SECURITY_DEVICES}/:id`, () => {
    it('should return 401 if no refresh token', async () => {
      await request(app)
        .delete(`${PATH.SECURITY_DEVICES}/123`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if refreshToken is wrong', async () => {
      await request(app)
        .delete(`${PATH.SECURITY_DEVICES}/123`)
        .set('Cookie', 'refreshToken=refreshToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 404 if no such id', async () => {
      const { refreshToken } = await createUserAndLogin(app);

      await request(app)
        .delete(`${PATH.SECURITY_DEVICES}/${crypto.randomUUID()}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.NotFound);
    });

    it('should return 403 if try to delete the deviceId of other user', async () => {
      await createUser(app, userDto.create[0]);
      await createUser(app, userDto.create[1]);
      const [user1Tokens] = await loginUserWithDifferentUserAgent(
        2,
        app,
        userDto.create[0],
      );
      const [user2Tokens] = await loginUserWithDifferentUserAgent(
        2,
        app,
        userDto.create[1],
      );
      // @ts-ignore
      const user1DeviceId1 = jws.decode(user1Tokens.refreshToken)?.deviceId;
      // @ts-ignore
      const user2DeviceId1 = jws.decode(user2Tokens.refreshToken)?.deviceId;

      await request(app)
        .delete(`${PATH.SECURITY_DEVICES}/${user2DeviceId1}`)
        .set('Cookie', `refreshToken=${user1Tokens.refreshToken}`)
        .expect(HttpStatus.Forbidden);
      await request(app)
        .delete(`${PATH.SECURITY_DEVICES}/${user1DeviceId1}`)
        .set('Cookie', `refreshToken=${user2Tokens.refreshToken}`)
        .expect(HttpStatus.Forbidden);
    });

    it('unless should return 204', async () => {
      await createUser(app, userDto.create[0]);
      const [{ refreshToken }, userTokens2] =
        await loginUserWithDifferentUserAgent(2, app, userDto.create[0]);
      // @ts-ignore
      const user1DeviceId1 = jws.decode(userTokens2.refreshToken)?.deviceId;

      await request(app)
        .delete(`${PATH.SECURITY_DEVICES}/${user1DeviceId1}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HttpStatus.NoContent);
    });
  });
});
