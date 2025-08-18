import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
