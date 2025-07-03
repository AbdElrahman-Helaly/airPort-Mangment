import { registerEnumType } from '@nestjs/graphql';

export enum StaffRole {
  PILOT = 'Pilot',
  CREW = 'Crew',
  SECURITY = 'Security',
  GROUND = 'GroundStaff',
}

registerEnumType(StaffRole, {
  name: 'StaffRole',
});
