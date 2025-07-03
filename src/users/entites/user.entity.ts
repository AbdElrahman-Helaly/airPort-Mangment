import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Staff } from 'src/staff/entities/staff.Entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.PASSENGER })
  role: Role;

  @OneToOne(() => Passenger, (passenger) => passenger.user)
  passengerProfile?: Passenger;

  @OneToOne(() => Staff, (Staff) => Staff.user)
  staff?: Staff;
}
