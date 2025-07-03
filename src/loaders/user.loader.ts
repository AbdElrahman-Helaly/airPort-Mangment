import * as DataLoader from 'dataloader';
import { Repository, In } from 'typeorm';
import { User } from 'src/users/entites/user.entity';

export function createUserLoader(userRepo: Repository<User>) {
  return new DataLoader<string, User>(async (userIds: string[]) => {
    const users = await userRepo.findBy({ id: In(userIds) });
    console.log('Loading users for IDs:', userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    return userIds.map((id) => {
      const user = userMap.get(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    });
  });
}
