import { ValidationEntries } from '../../core/types/validation';
import { validateDto } from '../../core/utils/validate-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';
import { validateStringFactory } from '../../core/utils/validate-string-factory';

const validationEntries = [
  ['name', validateStringFactory(15)],
  ['description', validateStringFactory(500)],
  ['websiteUrl', validateStringFactory(100)],
] satisfies ValidationEntries<BlogUpdateDto>;

export function validateBlogUpdateDto(data: BlogUpdateDto) {
  return validateDto(data, validationEntries);
}
