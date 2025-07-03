import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Flight } from 'src/flights/entities/flight.entity';

@ObjectType()
@Entity()
export class Airport {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  location: string;

  @OneToMany(() => Flight, (flight) => flight.airport)
  flights: Flight[];
}
