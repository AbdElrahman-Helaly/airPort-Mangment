import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Flight } from 'src/flights/entities/flight.entity';
import { StaffRole } from '../enums/staffEnum';
import { User } from 'src/users/entites/user.entity';

@ObjectType()
@Entity()
export class Staff {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  employeeId: string;

  @Field(() => StaffRole)
  @Column({ type: 'enum', enum: StaffRole })
  role: StaffRole;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Flight, (flight) => flight.staff)
  assignedFlight: Flight;
}
