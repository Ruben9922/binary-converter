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
import alphabet from "./core/alphabet";
import RadixSelect from "./RadixSelect";
import RadixInput from "./RadixInput";
import Output from "./Output";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { SignMode } from "./core/signMode";
import SignModeRadioGroup from "./SignModeRadioGroup";
import { AnimatePresence, motion } from "framer-motion";
import { useImmerReducer } from "use-immer";
import { FaGithub } from "react-icons/fa";
import { VscArrowSwap } from "react-icons/vsc";
import { getFilteredRadixPresets } from "./core/radixPreset";
import { convert } from "./core/convert";
import State from "./core/state";
import reducer from "./core/reducer";
import {
  computeAllowedDigits,
  validate,
  validateInputRadix,
  validateInputSignMode, validateOutputRadix, validateOutputSignMode,
  validateValue,
} from "./core/validate";

const MotionFormControl = motion<FormControlProps>(FormControl);

const initialState: State = {
  value: "",
  isValueDirty: false,
  inputRadix: 2,
  outputRadix: 16,
  signedMode: false,
  inputSignMode: null,
  outputSignMode: null,
};

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const { colorMode, toggleColorMode } = useColorMode();

  const allowedDigits = computeAllowedDigits(state.inputRadix);

  const isValid = validate(state);
  const outputValue = isValid ? convert(state) : null;
  const filteredRadixPresets = getFilteredRadixPresets(state.signedMode);

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

          <FormControl id="value" isInvalid={state.isValueDirty && !!validateValue(state)}>
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
            <FormErrorMessage>{validateValue(state)}</FormErrorMessage>
          </FormControl>

          <AnimatePresence>
            {state.signedMode && state.inputRadix === 2 && (
              <MotionFormControl
                id="input-sign-mode"
                as="fieldset"
                isInvalid={!!validateInputSignMode(state)}
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
                <FormErrorMessage>{validateInputSignMode(state)}</FormErrorMessage>
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
                filteredRadixPresets={filteredRadixPresets}
              />
            </FormControl>
            <FormControl id="input-radix" isInvalid={!!validateInputRadix(state)}>
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
              <FormErrorMessage>{validateInputRadix(state)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={2}>
            <FormControl id="output-radix-preset">
              <FormLabel>Output radix preset</FormLabel>
              <RadixSelect
                radix={state.outputRadix}
                setRadix={setOutputRadix}
                filteredRadixPresets={filteredRadixPresets}
              />
            </FormControl>
            <FormControl id="output-radix" isInvalid={!!validateOutputRadix(state)}>
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
              <FormErrorMessage>{validateOutputRadix(state)}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <AnimatePresence>
            {state.signedMode && state.outputRadix === 2 && (
              <MotionFormControl
                id="output-sign-mode"
                as="fieldset"
                isInvalid={!!validateOutputSignMode(state)}
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
                <FormErrorMessage>{validateOutputSignMode(state)}</FormErrorMessage>
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
