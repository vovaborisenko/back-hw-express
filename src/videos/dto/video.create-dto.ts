import { Resolution } from '../types/videos';

export interface VideoCreateDto {
  title: string;
  author: string;
  availableResolutions: Resolution[];
}
