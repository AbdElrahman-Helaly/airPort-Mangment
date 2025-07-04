import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entites/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
