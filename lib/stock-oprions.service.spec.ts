import { Test, TestingModule } from '@nestjs/testing';
import { StockOptionsService } from './stock-options.service';

describe('StockOptionsService', () => {
  let service: StockOptionsService;
  const underlying = 60;
  const strike = 58;
  const time = 0.5;
  const interest = 0.035;
  const sigma = 0.2;
  const dividend = 0.0125;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [StockOptionsService],
    }).compile();

    service = moduleRef.get<StockOptionsService>(StockOptionsService);
  });

  describe('should correctly count call price', () => {
    it('without dividends', () => {
      const price = 5.0157;

      expect(service.priceCall(underlying, strike, time, interest, sigma)).toBe(price);
    });

    it('with dividends', () => {
      const price = 4.769;

      expect(service.priceCall(underlying, strike, time, interest, sigma, dividend)).toBe(price);
    });
  });

  describe('should correctly count put price', () => {
    it('without dividends', () => {
      const price = 2.0095;

      expect(service.pricePut(underlying, strike, time, interest, sigma)).toBe(price);
    });

    it('with dividends', () => {
      const price = 2.1367;

      expect(service.pricePut(underlying, strike, time, interest, sigma, dividend)).toBe(price);
    });
  });
});
