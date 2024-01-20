import alphabet from "./alphabet";
import { SignMode } from "./signMode";
import * as R from "ramda";
import State from "./state";

interface SignedDecimalValue {
  value: number;
  isNegative: boolean;
}

export function convert(state: State): string {
  const value = state.value.toUpperCase();

  const decimalValue = convertToDecimal(value, state.inputRadix!, state.signedMode, state.inputSignMode);
  const outputString = convertFromDecimal(decimalValue, state.outputRadix!, state.signedMode, state.outputSignMode);

  return outputString;
}

function convertToDecimal(value: string, radix: number, signedMode: boolean, inputSignMode: SignMode | null): SignedDecimalValue {
  if (signedMode) {
    if (radix === 2) {
      const unsignedDecimalValue = convertToDecimalUnsigned(value, radix);
      // In all three of these signed number representations, the value is
      // negative if and only if the first bit is 1, i.e. the unsigned decimal
      // value is greater than or equal to 2^(N-1) (where N is the number of bits)
      const isNegative = unsignedDecimalValue >= radix ** (value.length - 1);
      switch (inputSignMode) {
        case "ones-complement":
          return {
            value: isNegative
              ? Math.abs(unsignedDecimalValue - ((radix ** value.length) - 1))
              : unsignedDecimalValue,
            isNegative,
          };
        case "twos-complement":
          return {
            value: isNegative
              ? Math.abs(unsignedDecimalValue - (radix ** value.length))
              : unsignedDecimalValue,
            isNegative,
          };
        case "sign-and-magnitude":
          return {
            value: isNegative
              ? Math.abs(unsignedDecimalValue - (radix ** (value.length - 1)))
              : unsignedDecimalValue,
            isNegative,
          };
      }
    } else if (radix === 10) {
      const isNegative = R.head(value) === "-";
      return {
        value: convertToDecimalUnsigned(isNegative ? R.tail(value) : value, radix),
        isNegative,
      };
    }
  }

  return {
    value: convertToDecimalUnsigned(value, radix),
    isNegative: false,
  };
}

function convertToDecimalUnsigned(value: string, radix: number): number {
  if (radix === 1) {
    return value.length;
  }

  return R.pipe(
    R.split(""),
    R.addIndex(R.map)((digit, index) => {
      const decimalDigit = R.indexOf(digit, R.split("", alphabet));
      const exponent = value.length - index - 1;
      return decimalDigit * Math.pow(radix, exponent);
    }),
    R.sum,
  )(value);
}

function convertFromDecimal(signedDecimalValue: SignedDecimalValue, radix: number, signedMode: boolean, outputSignMode: SignMode | null): string {
  if (signedMode) {
    if (radix === 2) {
      if (signedDecimalValue.isNegative) {
        // Could refactor to use bitwise NOT instead
        let bitCount = Math.ceil(Math.log2(signedDecimalValue.value + 1));
        if (outputSignMode !== "twos-complement" || signedDecimalValue.value !== radix ** (bitCount - 1)) {
          bitCount++;
        }
        switch (outputSignMode) {
          case "ones-complement":
            return convertFromDecimalUnsigned(-signedDecimalValue.value + (radix ** bitCount) - 1, radix);
          case "twos-complement":
            return convertFromDecimalUnsigned(-signedDecimalValue.value + (radix ** bitCount), radix);
          case "sign-and-magnitude":
            return convertFromDecimalUnsigned(signedDecimalValue.value + (radix ** (bitCount - 1)), radix);
        }
      } else {
        // If number is non-negative, prepend a zero to the output value because
        // positive signed values always start with a zero
        return `0${convertFromDecimalUnsigned(signedDecimalValue.value, radix)}`;
      }
    } else if (radix === 10) {
      return signedDecimalValue.isNegative
        ? `-${convertFromDecimalUnsigned(signedDecimalValue.value, radix)}`
        : convertFromDecimalUnsigned(signedDecimalValue.value, radix);
    }
  }

  return convertFromDecimalUnsigned(signedDecimalValue.value, radix);
}

function convertFromDecimalUnsigned(decimalValue: number, radix: number): string {
  if (decimalValue === 0) {
    return "0";
  }

  if (radix === 1) {
    return R.join("", R.repeat("1", decimalValue));
  }

  let quotient = decimalValue;
  let value = "";
  while (quotient > 0) {
    const remainder = quotient % radix;
    quotient = Math.floor(quotient / radix);
    value = R.concat(alphabet[remainder], value);
  }
  return value;
}
