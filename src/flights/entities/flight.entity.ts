import {
  Field,
  ID,
  ObjectType,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Staff } from 'src/staff/entities/staff.Entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FlightStatus } from '../enums/flightsStatus';
import { Airport } from 'src/airport/entities/airport.entity';

@ObjectType()
@Entity('flights')
export class Flight {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  flightNumber: string;

  @Column()
  @Field()
  departureAirport: string;
  @Field()
  @Column()
  destinationAirport: string;

  @Field()
  @Column('timestamptz')
  departureTime: Date;

  @Field(() => GraphQLISODateTime)
  @Column('timestamptz')
  arrivalTime: Date;

  @Field()
  @Column()
  airline: string;

  @Field(() => Int)
  @Column('int')
  availableSeats: number;

  @Field(() => FlightStatus)
  @Column({
    type: 'enum',
    enum: FlightStatus,
    default: FlightStatus.ON_TIME,
  })
  status: FlightStatus;

  @OneToMany(() => Staff, (staff) => staff.assignedFlight)
  staff: Staff[];

  @ManyToOne(() => Airport, (airport) => airport.flights)
  @Field(() => Airport)
  airport: Airport;
}
