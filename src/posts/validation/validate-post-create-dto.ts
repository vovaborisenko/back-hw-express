import { PostCreateDto } from '../dto/post.create-dto';
import { ValidationEntries } from '../../core/types/validation';
import { validateDto } from '../../core/utils/validate-dto';
import { validateStringFactory } from '../../core/utils/validate-string-factory';

const validationEntries = [
  ['title', validateStringFactory(30)],
  ['shortDescription', validateStringFactory(100)],
  ['content', validateStringFactory(1000)],
  ['blogId', validateStringFactory()],
] satisfies ValidationEntries<PostCreateDto>;

export function validatePostCreateDto(data: PostCreateDto) {
  return validateDto(data, validationEntries);
}
