import { BlogCreateDto } from '../dto/blog.create-dto';
import { ValidationEntries } from '../../core/types/validation';
import { validateDto } from '../../core/utils/validate-dto';
import { validateStringFactory } from '../../core/utils/validate-string-factory';

const validationEntries = [
  ['name', validateStringFactory(15)],
  ['description', validateStringFactory(500)],
  ['websiteUrl', validateStringFactory(100)],
] satisfies ValidationEntries<BlogCreateDto>;

export function validateBlogCreateDto(data: BlogCreateDto) {
  return validateDto(data, validationEntries);
}
