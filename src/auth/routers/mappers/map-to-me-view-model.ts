import { WithId } from 'mongodb';
import { MeViewModel } from '../../types/me.view-model';
import { User } from '../../../users/types/user';

export function mapToMeViewModel(user: WithId<User>): MeViewModel {
  return {
    userId: user._id.toString(),
    login: user.login,
    email: user.email,
  };
}
