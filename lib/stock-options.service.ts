import { Injectable } from '@nestjs/common';
import { callPrice, putPrice } from 'stock-options-calculator'
import { ToPrecision } from './to-precision';

@Injectable()
export class StockOptionsService {
  /**
   * computes the fair value of the call based on the knowns and assumed volatility (sigma)
   */
  @ToPrecision()
  priceCall(
    underlying: number,
    strike: number,
    time: number,
    interest: number,
    sigma: number,
    dividend = 0,
  ): number {
    return callPrice({
      strike,
      dividend,
      stock: underlying,
      interestRate: interest,
      volatility: sigma,
      timeToExpire: time,
    });
  }

  /**
   * computes the fair value of the put based on the knowns and assumed volatility (sigma)
   */
  @ToPrecision()
  pricePut(
    underlying: number,
    strike: number,
    time: number,
    interest: number,
    sigma: number,
    dividend = 0,
  ): number {
    return putPrice({
      strike,
      dividend,
      stock: underlying,
      interestRate: interest,
      volatility: sigma,
      timeToExpire: time,
    });
  }
}
