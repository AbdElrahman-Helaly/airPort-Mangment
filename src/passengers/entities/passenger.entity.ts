import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Baggage } from 'src/baggage/entites/baggage.entity';

@ObjectType()
@Entity()
export class Passenger {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column({ unique: true })
  passportNumber: string;

  @Field()
  @Column()
  nationality: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Booking, (booking) => booking.passenger)
  bookings: Booking[];

  @OneToMany(() => Baggage, (baggage) => baggage.passenger)
  @Field(() => [Baggage], { nullable: true })
  baggage: Baggage[];
}
