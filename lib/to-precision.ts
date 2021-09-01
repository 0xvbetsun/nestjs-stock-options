export function ToPrecision(precision = 4) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function () {
      const result = originalMethod.apply(this, arguments);

      return Math.round((result + Number.EPSILON) * 10 ** precision) / 10 ** precision;
    };

    return descriptor;
  };
}
