import request from 'supertest';
import { PATH } from '../../../../src/core/paths/paths';
import { validAuth } from '../../constants/common';
import { HttpStatus } from '../../../../src/core/types/http-status';
import type { App } from 'supertest/types';
import { UserCreateDto } from '../../../../src/users/dto/user.create-dto';
import { UserViewModel } from '../../../../src/users/types/user.view-model';

export const userDto: { create: UserCreateDto[] } = {
  create: [
    {
      login: 'myLogin',
      email: 'ask@rest.com',
      password: 'some#Strict@pass',
    },
    {
      login: 'Login2',
      email: 'seek@opt.de',
      password: 'pass)(ssap',
    },
  ],
};

export async function createUser(
  app: App,
  dto: UserCreateDto = userDto.create[0],
): Promise<UserViewModel> {
  const { body: user } = await request(app)
    .post(PATH.USERS)
    .set('Authorization', validAuth)
    .send(dto)
    .expect(HttpStatus.Created);

  return user;
}

export async function createUsers(
  count: number,
  app: App,
  dto: UserCreateDto = userDto.create[0],
): Promise<UserViewModel[]> {
  const requests = Array.from({ length: count }).map((_, index) =>
    createUser(app, {
      login: `${dto.login}${index}`,
      email: `${dto.email}${index}`,
      password: `${dto.password}${index}`,
    }),
  );

  return Promise.all(requests);
}

export async function createUserAndLogin(
  app: App,
  dto: UserCreateDto = userDto.create[0],
): Promise<{ user: UserViewModel; token: string }> {
  const user = await createUser(app, dto);
  const {
    body: { accessToken },
  } = await request(app)
    .post(`${PATH.AUTH}/login`)
    .send({
      loginOrEmail: dto.login,
      password: dto.password,
    })
    .expect(HttpStatus.Ok);

  return {
    user,
    token: accessToken,
  };
}
