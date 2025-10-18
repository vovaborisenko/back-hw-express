import { ValidationEntries } from '../../core/types/validation';
import { validateDto } from '../../core/utils/validate-dto';
import { PostUpdateDto } from '../dto/post.update-dto';
import { validateStringFactory } from '../../core/utils/validate-string-factory';

const validationEntries = [
  ['title', validateStringFactory(30)],
  ['shortDescription', validateStringFactory(100)],
  ['content', validateStringFactory(1000)],
  ['blogId', validateStringFactory()],
] satisfies ValidationEntries<PostUpdateDto>;

export function validatePostUpdateDto(data: PostUpdateDto) {
  return validateDto(data, validationEntries);
}
