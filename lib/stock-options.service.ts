import { Injectable } from '@nestjs/common';
import { ToPrecision } from './to-precision';

// used for min/max normal distribution
const MIN_Z_SCORE = -8;
const MAX_Z_SCORE = 8;

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
    const d1 = this.dOne(underlying, strike, time, interest, sigma, dividend);
    const discountedUnderlying = Math.exp(-1 * dividend * time) * underlying;
    const probabilityWeightedValueOfBeingExercised = discountedUnderlying * this.normSDist(d1);
    const d2 = d1 - sigma * Math.sqrt(time);
    const discountedStrike = Math.exp(-1 * interest * time) * strike;
    const probabilityWeightedValueOfDiscountedStrike = discountedStrike * this.normSDist(d2);

    return probabilityWeightedValueOfBeingExercised - probabilityWeightedValueOfDiscountedStrike;
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
    const d2 = this.dTwo(underlying, strike, time, interest, sigma, dividend);

    const discountedStrike = strike * Math.exp(-1 * interest * time);
    const probabiltityWeightedValueOfDiscountedStrike = discountedStrike * this.normSDist(-1 * d2);
    const d1 = d2 + sigma * Math.sqrt(time);
    const discountedUnderlying = underlying * Math.exp(-1 * dividend * time);
    const probabilityWeightedValueOfBeingExercised = discountedUnderlying * this.normSDist(-1 * d1);

    return probabiltityWeightedValueOfDiscountedStrike - probabilityWeightedValueOfBeingExercised;
  }

  /**
   * probability of being exercised at maturity (must be greater than d2 by (sigma*sqrt(time)) if exercised)
   */
  private dOne(
    underlying: number,
    strike: number,
    time: number,
    interest: number,
    sigma: number,
    dividend: number,
  ): number {
    const numerator =
      Math.log(underlying / strike) + (interest - dividend + 0.5 * sigma ** 2) * time;
    const denominator = sigma * Math.sqrt(time);

    return numerator / denominator;
  }

  /**
   * probability of underlying reaching the strike price (must be smaller than d1 by (sigma*sqrt(time)) if exercised.
   */
  private dTwo(
    underlying: number,
    strike: number,
    time: number,
    interest: number,
    sigma: number,
    dividend: number,
  ) {
    return this.dOne(underlying, strike, time, interest, sigma, dividend) - sigma * Math.sqrt(time);
  }

  /**
   * Normal Standard Distribution
   * using Taylor's approximation
   */
  private normSDist(z: number): number {
    if (z < MIN_Z_SCORE) {
      return 0;
    }
    if (z > MAX_Z_SCORE) {
      return 1;
    }

    let i = 3;
    let sum = 0;
    let term = z;

    while (sum + term !== sum) {
      sum += term;
      term = (term * z ** 2) / i;
      i += 2;
    }

    return 0.5 + sum * this.phi(z);
  }

  /**
   * Standard Gaussian pdf
   */
  private phi(x: number): number {
    const numerator = Math.exp((-1 * x ** 2) / 2);
    const denominator = Math.sqrt(2 * Math.PI);

    return numerator / denominator;
  }
}
