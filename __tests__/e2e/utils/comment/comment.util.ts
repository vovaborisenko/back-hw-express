import type { App } from 'supertest/types';
import request from 'supertest';
import { PATH } from '../../../../src/core/paths/paths';
import { HttpStatus } from '../../../../src/core/types/http-status';
import { PostViewModel } from '../../../../src/posts/types/post.view-model';
import { CommentUpdateDto } from '../../../../src/comments/dto/comment.update-dto';
import { CommentCreateDto } from '../../../../src/comments/dto/comment.create-dto';
import { CommentViewModel } from '../../../../src/comments/types/comment.view-model';
import { createUserAndLogin } from '../user/user.util';
import { createBlogAndHisPost } from '../post/post.util';
import { UserViewModel } from '../../../../src/users/types/user.view-model';

export const commentDto: {
  create: CommentCreateDto;
  update: CommentUpdateDto;
} = {
  create: {
    content:
      'TypeScript 5.0 представляет множество улучшений производительности и новые возможности...',
  },
  update: {
    content:
      'React 18 приносит революционные изменения в рендеринг приложений...',
  },
};

export async function createComment(
  app: App,
  dto: CommentCreateDto = commentDto.create,
): Promise<[CommentViewModel, PostViewModel, string, UserViewModel]> {
  const { token, user } = await createUserAndLogin(app);
  const [, post] = await createBlogAndHisPost(app);
  const { body: comment } = await request(app)
    .post(`${PATH.POSTS}/${post.id}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(dto)
    .expect(HttpStatus.Created);

  return [comment, post, token, user];
}

export async function createComments(
  count: number,
  app: App,
  dto: CommentCreateDto = commentDto.create,
): Promise<[CommentViewModel[], PostViewModel, string]> {
  const { token } = await createUserAndLogin(app);
  const [, post] = await createBlogAndHisPost(app);
  const requests = Array.from({ length: count }).map((_, index) =>
    request(app)
      .post(`${PATH.POSTS}/${post.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: `${dto.content}${index}` })
      .expect(HttpStatus.Created)
      .then(({ body }) => body),
  );
  const comments = await Promise.all(requests);

  return [comments, post, token];
}
