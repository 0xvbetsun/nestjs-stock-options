import { DynamicModule, Module } from '@nestjs/common';
import { StockOptionsService } from './stock-options.service';

@Module({})
export class StockOptionsModule {
  static register(): DynamicModule {
    const providers = [
      {
        provide: StockOptionsService,
        useValue: new StockOptionsService(),
      },
    ];

    return {
      module: StockOptionsModule,
      providers,
      exports: providers,
    };
  }
}
