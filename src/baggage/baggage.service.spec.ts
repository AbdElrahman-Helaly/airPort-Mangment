import { Test, TestingModule } from '@nestjs/testing';
import { BaggageService } from './baggage.service';

describe('BaggageService', () => {
  let service: BaggageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaggageService],
    }).compile();

    service = module.get<BaggageService>(BaggageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
