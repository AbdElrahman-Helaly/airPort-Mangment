import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FlightsModule } from './flights/flights.module';
import { PassengersModule } from './passengers/passengers.module';
import { BookingModule } from './booking/booking.module';
import { StaffModule } from './staff/staff.module';
import { AirportModule } from './airport/airport.module';
import { createUserLoader } from './loaders/user.loader';
import { User } from './users/entites/user.entity';
import { createPassengerLoader } from './loaders/passenger.loader';
import { createFlightLoader } from './loaders/flight.loader';
import { BaggageModule } from './baggage/baggage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [TypeOrmModule.forFeature([User])],
      inject: [getRepositoryToken(User)],
      useFactory: (userRepo, passengerRepo, flightRepo) => ({
        autoSchemaFile: true,
        playground: true,
        subscriptions: {
          'graphql-ws': true,
        },
        context: ({ req, connection }) => {
          const ctx = connection ? connection.context : { req };
          return {
            ...ctx,
            loaders: {
              userLoader: createUserLoader(userRepo),
              passengerLoader: createPassengerLoader(passengerRepo),
              flightLoader: createFlightLoader(flightRepo),
            },
          };
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '171199',
      database: 'AirPort_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    FlightsModule,
    PassengersModule,
    BookingModule,
    StaffModule,
    AirportModule,
    BaggageModule,
  ],
})
export class AppModule {}
