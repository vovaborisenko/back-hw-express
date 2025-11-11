import { User } from '../../types/user';
import { UserViewModel } from '../../types/user.view-model';
import { WithId } from 'mongodb';

export function mapToUserViewModel(user: WithId<User>): UserViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
