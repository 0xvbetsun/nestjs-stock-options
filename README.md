<h1 align="center">NestJS Stock Options</h1>

<p align="center">NestJS module for basic manipulation with stock options 📈</p>

## About

`nestjs-stock-options` implements a module, which when imported into
your nestjs project provides an access to the stock options calculation in every class that injects it. This
lets calculations be worked into your dependency injection workflow without having to
do any extra work outside of the initial setup.

## Installation

```bash
npm install --save nestjs-stock-options
```

## Getting Started

The simplest way to use `nestjs-stock-options` is to use `StockOptionsModule.register`

```typescript
import { Module } from '@nestjs-common';
import { StockOptionsModule } from 'nestjs-stock-options';

@Module({
  imports: [
    StripeModule.register(),
  ],
})
export class AppModule {}
```
You can then inject the Calculator into any of your injectables by using a DI

```typescript
import { Injectable } from '@nestjs/common';
import { StockOptionsService } from 'nestjs-stock-options';

@Injectable()
export class AppService {
  public constructor(private readonly stockOptionsService: StockOptionsService) {}
}
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
