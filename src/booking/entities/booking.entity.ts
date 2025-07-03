import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Flight } from 'src/flights/entities/flight.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity('bookings')
@Unique(['flight', 'seatNumber'])
export class Booking {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  seatNumber: string;

  @Field(() => Passenger)
  @ManyToOne(() => Passenger, { eager: true, onDelete: 'CASCADE' })
  passenger: Passenger;

  @Field(() => Flight)
  @ManyToOne(() => Flight, { eager: true })
  flight: Flight;
}
