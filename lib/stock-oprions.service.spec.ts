import { Test, TestingModule } from '@nestjs/testing';
import { StockOptionsService } from './stock-options.service';

describe('StockOptionsService', () => {
  let service: StockOptionsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [StockOptionsService],
    }).compile();

    service = moduleRef.get<StockOptionsService>(StockOptionsService);
  });

  describe('should correctly count call price', () => {
    const underlying = 60;
    const strike = 58;
    const time = 0.5;
    const interest = 0.035;
    const sigma = 0.2;
    it('without dividends', () => {
      const price = 5.0157;

      expect(service.priceCall(underlying, strike, time, interest, sigma)).toBe(price);
    });

    it('with dividends', () => {
      const dividend = 0.0125;
      const price = 4.769;

      expect(service.priceCall(underlying, strike, time, interest, sigma, dividend)).toBe(price);
    });
  });
});
