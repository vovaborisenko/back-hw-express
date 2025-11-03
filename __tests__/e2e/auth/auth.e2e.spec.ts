import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';

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
  });
});
