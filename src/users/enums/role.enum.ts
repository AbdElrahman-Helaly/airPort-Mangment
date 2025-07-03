import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  PASSENGER = 'PASSENGER',
}
registerEnumType(Role, { name: 'Role' });
