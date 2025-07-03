import { Test, TestingModule } from '@nestjs/testing';
import { BaggageResolver } from './baggage.resolver';

describe('BaggageResolver', () => {
  let resolver: BaggageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaggageResolver],
    }).compile();

    resolver = module.get<BaggageResolver>(BaggageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
