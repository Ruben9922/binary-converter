import React, { useEffect, useState } from "react";
import * as R from "ramda";
import {
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
  Switch,
  Tooltip,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import RadixSelect from "./RadixSelect";
import RadixInput from "./RadixInput";
import Output from "./Output";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { SignMode } from "./signMode";
import SignModeRadioGroup from "./SignModeRadioGroup";

// TODO: Could make this an array instead of a string
// noinspection SpellCheckingInspection
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface SignedDecimalValue {
  value: number;
  isNegative: boolean;
}

function convert(
  value: string,
  inputRadix: number | null,
  outputRadix: number | null,
  signedMode: boolean,
  inputSignMode: SignMode | null,
  outputSignMode: SignMode | null,
): string {
  value = value.toUpperCase();

  const decimalValue = convertToDecimal(value, inputRadix!, signedMode, inputSignMode);
  const outputString = convertFromDecimal(decimalValue, outputRadix!, signedMode, outputSignMode);

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

function App() {
  const [value, setValue] = useState("");
  const [isValueDirty, setIsValueDirty] = useState(false);
  const [inputRadix, setInputRadix] = useState<number | null>(2);
  const [outputRadix, setOutputRadix] = useState<number | null>(16);
  const [signedMode, setSignedMode] = useState(false);
  const [inputSignMode, setInputSignMode] = useState<SignMode | null>(null);
  const [outputSignMode, setOutputSignMode] = useState<SignMode | null>(null);

  const { colorMode, toggleColorMode } = useColorMode();

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

    const containsOnlyAllowedDigits = (x: string): boolean => R.isEmpty(R.difference(R.split("", x.toUpperCase()), allowedDigits));

    if (signedMode && inputRadix === 10) {
      if (!containsOnlyAllowedDigits(value) && (R.head(value) !== "-" || R.isEmpty(R.tail(value)) || !containsOnlyAllowedDigits(R.tail(value)))) {
        return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}. Value may start with a hyphen (-).`;
      }
    } else {
      if (!containsOnlyAllowedDigits(value)) {
        return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}.`;
      }
    }

    return "";
  };

  const validateRadix = (radix: number | null): string => {
    if (radix === null) {
      return "Radix cannot be empty.";
    }

    if (signedMode && radix !== 2 && radix !== 10) {
      return "Radix must be 2 or 10 in signed mode.";
    }

    if (radix <= 0) {
      return "Radix must be greater than zero.";
    }

    if (radix > alphabet.length) {
      return `Radix must be less than or equal to ${alphabet.length}`;
    }

    return "";
  };

  const validateSignMode = (signMode: SignMode | null, radix: number | null): string => {
    if (signedMode && radix === 2 && signMode === null) {
      return "Sign mode cannot be left blank.";
    }

    return "";
  };

  const isValid = !validateRadix(inputRadix) && !validateRadix(outputRadix) && !validateValue() && !validateSignMode(inputSignMode, inputRadix) && !validateSignMode(outputSignMode, outputRadix);
  const outputValue = isValid ? convert(value, inputRadix, outputRadix, signedMode, inputSignMode, outputSignMode) : null;

  useEffect(() => {
    setInputSignMode(null);
    setOutputSignMode(null);
  }, [signedMode]);
  useEffect(() => {
    setInputSignMode(null);
  }, [inputRadix]);
  useEffect(() => {
    setOutputSignMode(null);
  }, [outputRadix]);

  useEffect(() => {
    if (signedMode) {
      if (inputRadix === 2) {
        setOutputRadix(10);
      }
      if (inputRadix === 10) {
        setOutputRadix(2);
      }
    }
  }, [inputRadix, signedMode]);
  useEffect(() => {
    if (signedMode) {
      if (outputRadix === 2) {
        setInputRadix(10);
      }
      if (outputRadix === 10) {
        setInputRadix(2);
      }
    }
  }, [outputRadix, signedMode]);

  return (
    <>
      <Container mt="30px">
        <Grid
          gridTemplateColumns="1fr auto"
          columnGap={2}
          // alignItems="baseline"
        >
          <Heading mb={6}>Binary Converter</Heading>
          <Tooltip label={"Toggle dark mode"}>
            <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle dark mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            />
          </Tooltip>
        </Grid>

        <VStack spacing={5} align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="signed-mode" mb="0">
              Signed mode
            </FormLabel>
            <Switch
              id="signed-mode"
              isChecked={signedMode}
              onChange={event => setSignedMode(event.target.checked)}
            />
          </FormControl>

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
              <FormHelperText>
                {signedMode && inputRadix === 10
                  ? `May only contain the following digits: ${R.join(", ", allowedDigits)}. May start with a hyphen (-).`
                  : `May only contain the following digits: ${R.join(", ", allowedDigits)}.`}
              </FormHelperText>
            )}
            <FormErrorMessage>{validateValue()}</FormErrorMessage>
          </FormControl>

          {signedMode && inputRadix === 2 && (
            <FormControl id="input-sign-mode" as="fieldset" isInvalid={!!validateSignMode(inputSignMode, inputRadix)}>
              <FormLabel as="legend">Input sign mode</FormLabel>
              <SignModeRadioGroup
                signMode={inputSignMode}
                setSignMode={setInputSignMode}
              />
              <FormHelperText>Select how negative values are represented in the input value.</FormHelperText>
              <FormErrorMessage>{validateSignMode(inputSignMode, inputRadix)}</FormErrorMessage>
            </FormControl>
          )}

          {/*todo: untouched state for radix preset selects*/}
          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="input-radix-preset">
              <FormLabel>Input radix preset</FormLabel>
              <RadixSelect
                radix={inputRadix}
                setRadix={setInputRadix}
                signedMode={signedMode}
              />
            </FormControl>
            <FormControl id="input-radix" isInvalid={!!validateRadix(inputRadix)}>
              <FormLabel>Input radix</FormLabel>
              <RadixInput
                radix={inputRadix}
                setRadix={setInputRadix}
                alphabet={alphabet}
                signedMode={signedMode}
              />
              <FormHelperText>
                {signedMode
                  ? "Radix must be 2 or 10 in signed mode."
                  : "Any integer between 1 and 36 (inclusive)."}
              </FormHelperText>
              <FormErrorMessage>{validateRadix(inputRadix)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="output-radix-preset">
              <FormLabel>Output radix preset</FormLabel>
              <RadixSelect
                radix={outputRadix}
                setRadix={setOutputRadix}
                signedMode={signedMode}
              />
            </FormControl>
            <FormControl id="output-radix" isInvalid={!!validateRadix(outputRadix)}>
              <FormLabel>Output radix</FormLabel>
              <RadixInput
                radix={outputRadix}
                setRadix={setOutputRadix}
                alphabet={alphabet}
                signedMode={signedMode}
              />
              <FormHelperText>
                {signedMode
                  ? "Radix must be 2 or 10 in signed mode."
                  : "Any integer between 1 and 36 (inclusive)."}
              </FormHelperText>
              <FormErrorMessage>{validateRadix(outputRadix)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {signedMode && outputRadix === 2 && (
            <FormControl id="output-sign-mode" as="fieldset" isInvalid={!!validateSignMode(outputSignMode, outputRadix)}>
              <FormLabel as="legend">Output sign mode</FormLabel>
              <SignModeRadioGroup
                signMode={outputSignMode}
                setSignMode={setOutputSignMode}
              />
              <FormHelperText>Select how negative values are represented in the output value.</FormHelperText>
              <FormErrorMessage>{validateSignMode(outputSignMode, outputRadix)}</FormErrorMessage>
            </FormControl>
          )}

          <Divider />
          <Output outputValue={outputValue} />
        </VStack>
      </Container>
    </>
  );
}

export default App;
