import { Test, TestingModule } from '@nestjs/testing';
import { PassengersResolver } from './passengers.resolver';

describe('PassengersResolver', () => {
  let resolver: PassengersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassengersResolver],
    }).compile();

    resolver = module.get<PassengersResolver>(PassengersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
