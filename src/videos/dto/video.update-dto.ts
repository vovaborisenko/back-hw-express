import { Resolution } from '../types/videos';

export interface VideoUpdateDto {
  title: string;
  author: string;
  availableResolutions: Resolution[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
}
