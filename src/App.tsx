import React, { useState } from "react";
import * as R from "ramda";
import {
  Code,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isValid(
  value: string,
  inputRadix: number,
  outputRadix: number,
): boolean {
  return (
    isRadixValid(inputRadix) &&
    isRadixValid(outputRadix) &&
    isValueValid(value, inputRadix)
  );
}

function isRadixValid(radix: number): boolean {
  return radix > 0 && radix <= alphabet.length;
}

function isValueValid(value: string, inputRadix: number): boolean {
  if (inputRadix === 1) {
    return R.all((digit) => digit === "1", R.split("", value));
  }

  // return value.split("").every(digit => alphabet.includes(digit) && alphabet.indexOf(digit) < inputRadix);
  return R.all(
    (digit) =>
      R.includes(digit, alphabet) &&
      R.indexOf(digit, R.split("", alphabet)) < inputRadix,
    R.split("", value),
  );
}

function convert(
  value: string,
  inputRadix: number,
  outputRadix: number,
): string | null {
  value = value.toUpperCase();

  if (!isValid(value, inputRadix, outputRadix)) {
    return null;
  }

  const decimalValue = convertToDecimal(value, inputRadix);
  const outputString = convertFromDecimal(decimalValue, outputRadix);

  return outputString;
}

function convertToDecimal(value: string, radix: number): number {
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

function convertFromDecimal(decimalValue: number, radix: number): string {
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

function App() {
  const [value, setValue] = useState("");
  const [inputRadix, setInputRadix] = useState(2);
  const [outputRadix, setOutputRadix] = useState(16);

  const allowedDigits = inputRadix === 1
    ? ["1"]
    : R.split("", R.slice(0, inputRadix, alphabet));

  return (
    <>
      {/*<Header />*/}
      <Input
        value={value}
        placeholder="Input"
        onChange={(event) => setValue(event.target.value)}
        isInvalid={!isValueValid(value, inputRadix)}
      />
      <Text>Allowed digits: {R.join(", ", allowedDigits)}</Text>
      {/*<Select placeholder="Select option">*/}
      {/*  <option value="option1">Option 1</option>*/}
      {/*  <option value="option2">Option 2</option>*/}
      {/*  <option value="option3">Option 3</option>*/}
      {/*</Select>*/}
      <NumberInput
        value={inputRadix}
        min={1}
        max={alphabet.length}
        onChange={(_, updatedInputRadix) => setInputRadix(updatedInputRadix)}
        isInvalid={!isRadixValid(inputRadix)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <NumberInput
        value={outputRadix}
        min={1}
        max={alphabet.length}
        onChange={(_, updatedOutputRadix) => setOutputRadix(updatedOutputRadix)}
        isInvalid={!isRadixValid(outputRadix)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Text>
        Output: <Code>{convert(value, inputRadix, outputRadix)}</Code>
      </Text>
    </>
  );
}

export default App;
