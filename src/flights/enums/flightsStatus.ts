import { registerEnumType } from '@nestjs/graphql';

export enum FlightStatus {
  ON_TIME = 'onTime',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

registerEnumType(FlightStatus, {
  name: 'FlightStatus',
});
