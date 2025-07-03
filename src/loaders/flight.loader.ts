import * as DataLoader from 'dataloader';
import { Repository, In } from 'typeorm';
import { Flight } from 'src/flights/entities/flight.entity';

export function createFlightLoader(flightRepo: Repository<Flight>) {
  return new DataLoader<string, Flight>(async (flightIds: string[]) => {
    const flights = await flightRepo.findBy({ id: In(flightIds) });
    const flightMap = new Map(flights.map((f) => [f.id, f]));

    return flightIds.map((id) => {
      const flight = flightMap.get(id);
      if (!flight) throw new Error(`Flight with ID ${id} not found`);
      return flight;
    });
  });
}
