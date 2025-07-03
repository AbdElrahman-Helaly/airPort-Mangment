import * as DataLoader from 'dataloader';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { In, Repository } from 'typeorm';

export function createPassengerLoader(passengerRepo: Repository<Passenger>) {
  return new DataLoader<string, Passenger>(async (passengerIds: string[]) => {
    const passengers = await passengerRepo.findBy({ id: In(passengerIds) });
    const passengerMap = new Map(passengers.map((p) => [p.id, p]));

    return passengerIds.map((id) => {
      const passenger = passengerMap.get(id);
      if (!passenger) throw new Error(`Passenger with ID ${id} not found`);
      return passenger;
    });
  });
}
