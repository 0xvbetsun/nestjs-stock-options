import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StockOptionsModule } from './stock-options.module';
import { StockOptionsService } from './stock-options.service';

describe('StockOptionsModule', () => {
  describe('register', () => {
    it('should provide the StockOptionsService', async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [StockOptionsModule.register()],
      }).compile();

      const service = moduleRef.get<StockOptionsService>(StockOptionsService);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(StockOptionsService);
    });
  });
});
