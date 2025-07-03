import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum BaggageStatus {
  CHECKED_IN = 'CHECKED_IN',
  LOADED = 'LOADED',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  CLAIMED = 'CLAIMED',
}

registerEnumType(BaggageStatus, { name: 'BaggageStatus' });
