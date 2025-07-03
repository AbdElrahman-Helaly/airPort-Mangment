import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaggageStatus } from '../enums/baggageStatus';

@ObjectType()
@Entity()
export class Baggage {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  description: string;

  @Field(() => BaggageStatus)
  @Column({ type: 'enum', enum: BaggageStatus })
  status: BaggageStatus;

  @ManyToOne(() => Passenger, (passenger) => passenger.baggage)
  passenger: Passenger;
}
