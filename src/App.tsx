import React, { useState } from "react";
import * as R from "ramda";
import {
  Code,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import RadixSelect from "./RadixSelect";
import RadixInput from "./RadixInput";
import { CopyIcon } from "@chakra-ui/icons";

// TODO: Could make this an array instead of a string
// noinspection SpellCheckingInspection
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function convert(
  value: string,
  inputRadix: number | null,
  outputRadix: number | null,
): string {
  value = value.toUpperCase();

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
  const [isValueDirty, setIsValueDirty] = useState(false);
  const [inputRadix, setInputRadix] = useState<number | null>(2);
  const [outputRadix, setOutputRadix] = useState<number | null>(16);

  const allowedDigits = inputRadix === null ? [] : (
    inputRadix === 1
      ? ["1"]
      : R.split("", R.slice(0, inputRadix, alphabet))
  );

  const validateValue = (): string => {
    if (R.isEmpty(value)) {
      return "Value cannot be empty.";
    }

    if (validateRadix(inputRadix)) {
      return "";
    }

    if (!R.isEmpty(R.difference(R.split("", value.toUpperCase()), allowedDigits))) {
      return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}.`;
    }

    return "";
  };

  const validateRadix = (radix: number | null): string => {
    if (radix === null) {
      return "Radix cannot be empty.";
    }

    if (radix <= 0) {
      return "Radix must be greater than zero.";
    }

    if (radix > alphabet.length) {
      return `Radix must be less than or equal to ${alphabet.length}`;
    }

    return "";
  };

  const isValid = !validateRadix(inputRadix) && !validateRadix(outputRadix) && !validateValue();

  const outputValue = isValid ? convert(value, inputRadix, outputRadix) : null;
  const { hasCopied, onCopy } = useClipboard(outputValue ?? "");

  return (
    <>
      <Container mt="30px">
        <Heading mb={6}>Binary Converter</Heading>

        <VStack spacing={5} align="stretch">
          <FormControl id="value" isInvalid={isValueDirty && !!validateValue()}>
            <FormLabel>Value</FormLabel>
            <Input
              value={value}
              placeholder="Enter a value here"
              onChange={(event) => {
                setValue(event.target.value);
                setIsValueDirty(true);
              }}
              autoComplete="off"
            />
            {R.isEmpty(allowedDigits) || (
              <FormHelperText>May only contain the following digits: {R.join(", ", allowedDigits)}.</FormHelperText>
            )}
            <FormErrorMessage>{validateValue()}</FormErrorMessage>
          </FormControl>

          {/*todo: untouched state for radix preset selects*/}
          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="input-radix-preset">
              <FormLabel>Input radix preset</FormLabel>
              <RadixSelect radix={inputRadix} setRadix={setInputRadix} />
            </FormControl>
            <FormControl id="input-radix" isInvalid={!!validateRadix(inputRadix)}>
              <FormLabel>Input radix</FormLabel>
              <RadixInput
                radix={inputRadix}
                setRadix={setInputRadix}
                alphabet={alphabet}
              />
              <FormHelperText>Any integer between 1 and 36 (inclusive).</FormHelperText>
              <FormErrorMessage>{validateRadix(inputRadix)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="output-radix-preset">
              <FormLabel>Output radix preset</FormLabel>
              <RadixSelect radix={outputRadix} setRadix={setOutputRadix} />
            </FormControl>
            <FormControl id="output-radix" isInvalid={!!validateRadix(outputRadix)}>
              <FormLabel>Output radix</FormLabel>
              <RadixInput
                radix={outputRadix}
                setRadix={setOutputRadix}
                alphabet={alphabet}
              />
              <FormHelperText>Any integer between 1 and 36 (inclusive).</FormHelperText>
              <FormErrorMessage>{validateRadix(outputRadix)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Divider />
          <Grid
            gridTemplateColumns="1fr auto"
            columnGap={2}
            alignItems="center"
          >
            {isValid ? (
              <Code fontSize="3xl" noOfLines={10}>
                {outputValue ?? "(invalid input)"}
              </Code>
            ) : (
              <Text fontStyle="italic">
                Output will appear here…
              </Text>
            )}
            <Tooltip
              label={hasCopied ? "Copied!" : "Copy to clipboard"}
              closeOnClick={false}
            >
              <IconButton
                onClick={onCopy}
                disabled={!isValid}
                aria-label="Copy to clipboard"
                icon={<CopyIcon />}
              />
            </Tooltip>
          </Grid>
        </VStack>
      </Container>
    </>
  );
}

export default App;
