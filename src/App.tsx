import React from "react";
import * as R from "ramda";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
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
import { AnimatePresence, motion } from "framer-motion";
import { useImmerReducer } from "use-immer";
import { FaGithub } from "react-icons/fa";
import { VscArrowSwap } from "react-icons/vsc";

const MotionFormControl = motion<FormControlProps>(FormControl);

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

interface State {
  value: string;
  isValueDirty: boolean;
  inputRadix: number | null;
  outputRadix: number | null;
  signedMode: boolean;
  inputSignMode: SignMode | null;
  outputSignMode: SignMode | null;
}

type Action =
  | { type: "set-value", value: string }
  | { type: "set-input-radix", inputRadix: number | null }
  | { type: "set-output-radix", outputRadix: number | null }
  | { type: "set-signed-mode", signedMode: boolean }
  | { type: "set-input-sign-mode", inputSignMode: SignMode | null }
  | { type: "set-output-sign-mode", outputSignMode: SignMode | null }
  | { type: "swap", outputValue: string | null };

const initialState: State = {
  value: "",
  isValueDirty: false,
  inputRadix: 2,
  outputRadix: 16,
  signedMode: false,
  inputSignMode: null,
  outputSignMode: null,
};

function reducer(draft: State, action: Action): void {
  switch (action.type) {
    case "set-value":
      draft.value = action.value;
      draft.isValueDirty = true;
      return;
    case "set-input-radix":
      draft.inputRadix = action.inputRadix;

      draft.inputSignMode = null;
      draft.outputSignMode = null;

      if (draft.signedMode) {
        if (draft.inputRadix === 2) {
          draft.outputRadix = 10;
        }
        if (draft.inputRadix === 10) {
          draft.outputRadix = 2;
        }
      }

      return;
    case "set-output-radix":
      draft.outputRadix = action.outputRadix;

      draft.inputSignMode = null;
      draft.outputSignMode = null;

      if (draft.signedMode) {
        if (draft.outputRadix === 2) {
          draft.inputRadix = 10;
        }
        if (draft.outputRadix === 10) {
          draft.inputRadix = 2;
        }
      }

      return;
    case "set-signed-mode":
      draft.signedMode = action.signedMode;

      draft.inputSignMode = null;
      draft.outputSignMode = null;

      return;
    case "set-input-sign-mode":
      draft.inputSignMode = action.inputSignMode;
      return;
    case "set-output-sign-mode":
      draft.outputSignMode = action.outputSignMode;
      return;
    case "swap":
      const tempRadix = draft.inputRadix;
      draft.inputRadix = draft.outputRadix;
      draft.outputRadix = tempRadix;

      draft.value = action.outputValue ?? draft.value;

      if (draft.signedMode) {
        const tempSignMode = draft.inputSignMode;
        draft.inputSignMode = draft.outputSignMode;
        draft.outputSignMode = tempSignMode;
      }

      return;
  }
}

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const { colorMode, toggleColorMode } = useColorMode();

  const allowedDigits = state.inputRadix === null ? [] : (
    state.inputRadix === 1
      ? ["1"]
      : R.split("", R.slice(0, state.inputRadix, alphabet))
  );

  const validateValue = (): string => {
    if (R.isEmpty(state.value)) {
      return "Value cannot be empty.";
    }

    if (validateRadix(state.inputRadix)) {
      return "";
    }

    const containsOnlyAllowedDigits = (x: string): boolean => R.isEmpty(R.difference(R.split("", x.toUpperCase()), allowedDigits));

    if (state.signedMode && state.inputRadix === 10) {
      if (!containsOnlyAllowedDigits(state.value) && (R.head(state.value) !== "-" || R.isEmpty(R.tail(state.value)) || !containsOnlyAllowedDigits(R.tail(state.value)))) {
        return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}. Value may start with a hyphen (-).`;
      }
    } else {
      if (!containsOnlyAllowedDigits(state.value)) {
        return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}.`;
      }
    }

    return "";
  };

  const validateRadix = (radix: number | null): string => {
    if (radix === null) {
      return "Radix cannot be empty.";
    }

    if (state.signedMode && radix !== 2 && radix !== 10) {
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
    if (state.signedMode && radix === 2 && signMode === null) {
      return "Sign mode cannot be left blank.";
    }

    return "";
  };

  const isValid = !validateRadix(state.inputRadix) && !validateRadix(state.outputRadix) && !validateValue() && !validateSignMode(state.inputSignMode, state.inputRadix) && !validateSignMode(state.outputSignMode, state.outputRadix);
  const outputValue = isValid ? convert(state.value, state.inputRadix, state.outputRadix, state.signedMode, state.inputSignMode, state.outputSignMode) : null;

  const setValue = (value: string) => dispatch({ type: "set-value", value });
  const setInputRadix = (inputRadix: number | null): void => dispatch({ type: "set-input-radix", inputRadix });
  const setOutputRadix = (outputRadix: number | null): void => dispatch({ type: "set-output-radix", outputRadix });
  const setSignedMode = (signedMode: boolean) => dispatch({ type: "set-signed-mode", signedMode });
  const setInputSignMode = (inputSignMode: SignMode | null): void => dispatch({ type: "set-input-sign-mode", inputSignMode });
  const setOutputSignMode = (outputSignMode: SignMode | null): void => dispatch({ type: "set-output-sign-mode", outputSignMode });
  const swap = (): void => dispatch({ type: "swap", outputValue });

  return (
    <>
      <Container mt="30px">
        <Grid
          gridTemplateColumns="1fr auto"
          columnGap={2}
          mb={6}
          alignItems="start"
        >
          <Heading>Binary Converter</Heading>
          <HStack>
            <Tooltip label="GitHub repository">
              <Link
                href="https://github.com/Ruben9922/binary-converter"
                isExternal
              >
                <IconButton
                  icon={<FaGithub />}
                  aria-label="GitHub repository"
                />
              </Link>
            </Tooltip>
            <Tooltip label="Toggle dark mode">
              <IconButton
                onClick={toggleColorMode}
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                aria-label="Toggle dark mode"
              />
            </Tooltip>
          </HStack>
        </Grid>

        <VStack spacing={5} align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="signed-mode" mb="0">
              Signed mode
            </FormLabel>
            <Switch
              id="signed-mode"
              isChecked={state.signedMode}
              onChange={event => setSignedMode(event.target.checked)}
            />
          </FormControl>

          <FormControl id="value" isInvalid={state.isValueDirty && !!validateValue()}>
            <FormLabel>Value</FormLabel>
            <Input
              value={state.value}
              placeholder="Enter a value here"
              onChange={(event) => setValue(event.target.value)}
              autoComplete="off"
            />
            {R.isEmpty(allowedDigits) || (
              <FormHelperText>
                {state.signedMode && state.inputRadix === 10
                  ? `May only contain the following digits: ${R.join(", ", allowedDigits)}. May start with a hyphen (-).`
                  : `May only contain the following digits: ${R.join(", ", allowedDigits)}.`}
              </FormHelperText>
            )}
            <FormErrorMessage>{validateValue()}</FormErrorMessage>
          </FormControl>

          <AnimatePresence>
            {state.signedMode && state.inputRadix === 2 && (
              <MotionFormControl
                id="input-sign-mode"
                as="fieldset"
                isInvalid={!!validateSignMode(state.inputSignMode, state.inputRadix)}
                key="input-sign-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormLabel as="legend">Input sign mode</FormLabel>
                <SignModeRadioGroup
                  signMode={state.inputSignMode}
                  setSignMode={setInputSignMode}
                />
                <FormHelperText>Select how negative values are represented in the input value.</FormHelperText>
                <FormErrorMessage>{validateSignMode(state.inputSignMode, state.inputRadix)}</FormErrorMessage>
              </MotionFormControl>
            )}
          </AnimatePresence>

          {/*todo: untouched state for radix preset selects*/}
          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="input-radix-preset">
              <FormLabel>Input radix preset</FormLabel>
              <RadixSelect
                radix={state.inputRadix}
                setRadix={setInputRadix}
                signedMode={state.signedMode}
              />
            </FormControl>
            <FormControl id="input-radix" isInvalid={!!validateRadix(state.inputRadix)}>
              <FormLabel>Input radix</FormLabel>
              <RadixInput
                radix={state.inputRadix}
                setRadix={setInputRadix}
                alphabet={alphabet}
                signedMode={state.signedMode}
              />
              <FormHelperText>
                {state.signedMode
                  ? "Radix must be 2 or 10 in signed mode."
                  : "Any integer between 1 and 36 (inclusive)."}
              </FormHelperText>
              <FormErrorMessage>{validateRadix(state.inputRadix)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="output-radix-preset">
              <FormLabel>Output radix preset</FormLabel>
              <RadixSelect
                radix={state.outputRadix}
                setRadix={setOutputRadix}
                signedMode={state.signedMode}
              />
            </FormControl>
            <FormControl id="output-radix" isInvalid={!!validateRadix(state.outputRadix)}>
              <FormLabel>Output radix</FormLabel>
              <RadixInput
                radix={state.outputRadix}
                setRadix={setOutputRadix}
                alphabet={alphabet}
                signedMode={state.signedMode}
              />
              <FormHelperText>
                {state.signedMode
                  ? "Radix must be 2 or 10 in signed mode."
                  : "Any integer between 1 and 36 (inclusive)."}
              </FormHelperText>
              <FormErrorMessage>{validateRadix(state.outputRadix)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <AnimatePresence>
            {state.signedMode && state.outputRadix === 2 && (
              <MotionFormControl
                id="output-sign-mode"
                as="fieldset"
                isInvalid={!!validateSignMode(state.outputSignMode, state.outputRadix)}
                key="output-sign-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormLabel as="legend">Output sign mode</FormLabel>
                <SignModeRadioGroup
                  signMode={state.outputSignMode}
                  setSignMode={setOutputSignMode}
                />
                <FormHelperText>Select how negative values are represented in the output value.</FormHelperText>
                <FormErrorMessage>{validateSignMode(state.outputSignMode, state.outputRadix)}</FormErrorMessage>
              </MotionFormControl>
            )}
          </AnimatePresence>

          <Button onClick={swap} leftIcon={<VscArrowSwap />} alignSelf="center">
            Swap
          </Button>

          <Divider />
          <Output outputValue={outputValue} />
        </VStack>
      </Container>
    </>
  );
}

export default App;
