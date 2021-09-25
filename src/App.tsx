import React, { useState } from "react";
import * as R from "ramda";
import {
  Code,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import RadixSelect from "./RadixSelect";
import RadixInput from "./RadixInput";

// noinspection SpellCheckingInspection
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isValid(value: string, inputRadix: number | null, outputRadix: number | null): boolean {
  return (
    isRadixValid(inputRadix) &&
    isRadixValid(outputRadix) &&
    isValueValid(value, inputRadix)
  );
}

function isRadixValid(radix: number | null): boolean {
  return radix !== null && radix > 0 && radix <= alphabet.length;
}

function isValueValid(value: string, inputRadix: number | null): boolean {
  if (R.isEmpty(value)) {
    return false;
  }

  if (inputRadix === null) {
    return true;
  }

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
  inputRadix: number | null,
  outputRadix: number | null,
): string | null {
  value = value.toUpperCase();

  if (!isValid(value, inputRadix, outputRadix)) {
    return null;
  }

  const decimalValue = convertToDecimal(value, inputRadix!);
  const outputString = convertFromDecimal(decimalValue, outputRadix!);

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
  const [inputRadix, setInputRadix] = useState<number | null>(2);
  const [outputRadix, setOutputRadix] = useState<number | null>(16);

  const allowedDigits = inputRadix === null ? [] : (
    inputRadix === 1
      ? ["1"]
      : R.split("", R.slice(0, inputRadix, alphabet))
  );

  return (
    <>
      {/*<Header />*/}
      <Container mt="30px">
        <Heading mb={6}>Binary Converter</Heading>

        <VStack spacing={5} align="stretch">
          <FormControl id="value">
            <FormLabel>Value</FormLabel>
            <Input
              value={value}
              placeholder="Enter a value here"
              onChange={(event) => setValue(event.target.value)}
              isInvalid={!isValueValid(value, inputRadix)}
            />
            <FormHelperText>
              Allowed digits: {R.isEmpty(allowedDigits) ? "(none)" : R.join(", ", allowedDigits)}
            </FormHelperText>
          </FormControl>

          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="input-radix-preset">
              <FormLabel>Input radix preset</FormLabel>
              <RadixSelect radix={inputRadix} setRadix={setInputRadix} />
            </FormControl>
            <FormControl id="input-radix">
              <FormLabel>Input radix</FormLabel>
              <RadixInput
                radix={inputRadix}
                setRadix={setInputRadix}
                alphabet={alphabet}
                valid={isRadixValid(inputRadix)}
              />
              <FormHelperText>Any integer between 1 and 36 (inclusive).</FormHelperText>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="output-radix-preset">
              <FormLabel>Output radix preset</FormLabel>
              <RadixSelect radix={outputRadix} setRadix={setOutputRadix} />
            </FormControl>
            <FormControl id="output-radix">
              <FormLabel>Output radix</FormLabel>
              <RadixInput
                radix={outputRadix}
                setRadix={setOutputRadix}
                alphabet={alphabet}
                valid={isRadixValid(outputRadix)}
              />
              <FormHelperText>Any integer between 1 and 36 (inclusive).</FormHelperText>
            </FormControl>
          </SimpleGrid>

          <Text>
            Output:
            {" "}
            {isValid(value, inputRadix, outputRadix) ? (
              <Code>{convert(value, inputRadix, outputRadix)}</Code>
            ) : (
              <em>(none)</em>
            )}
          </Text>
        </VStack>
      </Container>
    </>
  );
}

export default App;
