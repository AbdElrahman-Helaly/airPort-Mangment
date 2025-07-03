import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from 'src/flights/entities/flight.entity';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { CreateBookingInput } from './dtos/createBookingInput';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,

    @InjectRepository(Passenger)
    private passengerRepo: Repository<Passenger>,
  ) {}

  async create(
    input: CreateBookingInput,
    currentUserId: string,
  ): Promise<Booking> {
    const passenger = await this.passengerRepo.findOne({
      where: { user: { id: currentUserId } },
    });

    if (!passenger) throw new NotFoundException('Passenger not found');

    const flight = await this.flightRepo.findOne({
      where: { id: input.flightId },
    });

    if (!flight) throw new NotFoundException('Flight not found');

    const existingBooking = await this.bookingRepo.findOne({
      where: {
        flight: { id: flight.id },
        seatNumber: input.seatNumber,
      },
    });

    if (existingBooking)
      throw new BadRequestException('This seat is already booked');

    if (flight.availableSeats <= 0)
      throw new BadRequestException('No seats available on this flight');

    const booking = this.bookingRepo.create({
      seatNumber: input.seatNumber,
      flight,
      passenger,
    });

    flight.availableSeats -= 1;
    await this.flightRepo.save(flight);
    return this.bookingRepo.save(booking);
  }

  async getBookedSeats(flightId: string): Promise<string[]> {
    const bookings = await this.bookingRepo.find({
      where: { flight: { id: flightId } },
      relations: ['flight'],
    });

    return bookings.map((booking) => booking.seatNumber);
  }

  async getMyBookings(userId: string): Promise<Booking[]> {
    const passenger = await this.passengerRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!passenger) throw new NotFoundException('Passenger profile not found');

    return this.bookingRepo.find({
      where: { passenger: { id: passenger.id } },
      relations: ['flight'],
    });
  }

  async cancelBooking(id: string, userId: string): Promise<boolean> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['passenger', 'passenger.user', 'flight'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.passenger.user.id !== userId) {
      throw new NotFoundException('Booking not found for this user');
    }

    booking.flight.availableSeats += 1;
    await this.flightRepo.save(booking.flight);

    await this.bookingRepo.remove(booking);
    return true;
  }
}
