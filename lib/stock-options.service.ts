import { Injectable } from '@nestjs/common';
import { parser, round } from 'mathjs';

// used for min/max normal distribution
const MIN_Z_SCORE = -8;
const MAX_Z_SCORE = 8;

@Injectable()
export class StockOptionsService {
  /**
   * computes the fair value of the call based on the knowns and assumed volatility (sigma)
   */
  priceCall(
    underlying: number,
    strike: number,
    time: number,
    interest: number,
    sigma: number,
    dividend = 0,
  ): number {
    const d1 = this.dOne(underlying, strike, time, interest, sigma, dividend);
    const discountedUnderlying = parser().evaluate(
      `exp(-1 * ${dividend} * ${time}) * ${underlying}`,
    );
    const probabilityWeightedValueOfBeingExercised = parser().evaluate(
      `${discountedUnderlying} * ${this.normSDist(d1)}`,
    );
    const d2 = parser().evaluate(`${d1} - ${sigma} * sqrt(${time})`);
    const discountedStrike = parser().evaluate(`exp(-1 * ${interest} * ${time}) * ${strike}`);
    const probabilityWeightedValueOfDiscountedStrike = parser().evaluate(
      `${discountedStrike} * ${this.normSDist(d2)}`,
    );

    return round(
      parser().evaluate(
        `${probabilityWeightedValueOfBeingExercised} - ${probabilityWeightedValueOfDiscountedStrike}`,
      ),
      4,
    );
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
    const numerator = parser().evaluate(
      `log(${underlying} / ${strike}) + (${interest} - ${dividend} + 0.5 * ${sigma}^2) * ${time}`,
    );
    const denominator = parser().evaluate(`${sigma} * sqrt(${time})`);

    return parser().evaluate(`${numerator} / ${denominator}`);
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
    return parser().evaluate(
      `${this.dOne(
        underlying,
        strike,
        time,
        interest,
        sigma,
        dividend,
      )} - ${sigma} * sqrt(${time})`,
    );
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
      term = parser().evaluate(`${term} * ${z}^2 / ${i}`);
      i += 2;
    }

    return parser().evaluate(`0.5 + ${sum} * ${this.phi(z)}`);
  }

  /**
   * Standard Gaussian pdf
   */
  private phi(x: number): number {
    const numerator = parser().evaluate(`exp(-1 * ${x}^2 / 2)`);
    const denominator = parser().evaluate('sqrt(2 * PI)');

    return parser().evaluate(`${numerator} / ${denominator}`);
  }
}
