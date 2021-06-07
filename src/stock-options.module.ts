import { DynamicModule, Module } from "@nestjs/common";
import { StockOptionsService } from "./stock-options.service";

@Module({})
export class StockOptionsModule {
  static forRoot(): DynamicModule {
    const providers = [
      {
        provide: StockOptionsService,
        useValue: new StockOptionsService(),
      },
    ];

    return {
      providers: providers,
      exports: providers,
      module: StockOptionsModule,
    };
  }
}
