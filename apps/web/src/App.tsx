import { Container, Divider, useColorMode, VStack } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useImmerReducer } from "use-immer";
import { convert } from "@binary-converter/core";
import { reducer } from "@binary-converter/core";
import { SignMode } from "@binary-converter/core";
import { initialState } from "@binary-converter/core";
import { validate } from "@binary-converter/core";
import InputRadixPreset from "./InputRadixPreset";
import InputSignMode from "./InputSignMode";
import Output from "./Output";
import OutputRadixPreset from "./OutputRadixPreset";
import OutputSignMode from "./OutputSignMode";
import SignedMode from "./SignedMode";
import SwapButton from "./SwapButton";
import TitleBar from "./TitleBar";
import Value from "./Value";

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const { colorMode, toggleColorMode } = useColorMode();

  const isValid = validate(state);
  const outputValue = isValid ? convert(state) : null;

  const setValue = (value: string): void => dispatch({ type: "set-value", value });
  const setInputRadix = (inputRadix: number | null): void => dispatch({ type: "set-input-radix", inputRadix });
  const setOutputRadix = (outputRadix: number | null): void => dispatch({ type: "set-output-radix", outputRadix });
  const setSignedMode = (signedMode: boolean): void => dispatch({ type: "set-signed-mode", signedMode });
  const setInputSignMode = (inputSignMode: SignMode | null): void => dispatch({ type: "set-input-sign-mode", inputSignMode });
  const setOutputSignMode = (outputSignMode: SignMode | null): void => dispatch({ type: "set-output-sign-mode", outputSignMode });
  const swap = (): void => dispatch({ type: "swap", outputValue });

  return (
    <>
      <Container mt="30px">
        <TitleBar colorMode={colorMode} toggleColorMode={toggleColorMode} />

        <VStack spacing={5} align="stretch">
          <SignedMode signedMode={state.signedMode} setSignedMode={setSignedMode} />

          <Value
            value={state.value}
            setValue={setValue}
            isValueDirty={state.isValueDirty}
            signedMode={state.signedMode}
            inputRadix={state.inputRadix}
          />

          <AnimatePresence>
            {state.signedMode && state.inputRadix === 2 && (
              <InputSignMode
                inputRadix={state.inputRadix}
                signedMode={state.signedMode}
                inputSignMode={state.inputSignMode}
                setInputSignMode={setInputSignMode}
              />
            )}
          </AnimatePresence>

          {/*todo: untouched state for radix preset selects*/}
          <InputRadixPreset
            inputRadix={state.inputRadix}
            setInputRadix={setInputRadix}
            signedMode={state.signedMode}
          />

          <OutputRadixPreset
            outputRadix={state.outputRadix}
            setOutputRadix={setOutputRadix}
            signedMode={state.signedMode}
          />

          <AnimatePresence>
            {state.signedMode && state.outputRadix === 2 && (
              <OutputSignMode
                outputRadix={state.outputRadix}
                signedMode={state.signedMode}
                outputSignMode={state.outputSignMode}
                setOutputSignMode={setOutputSignMode}
              />
            )}
          </AnimatePresence>

          <SwapButton swap={swap} />

          <Divider />
          <Output outputValue={outputValue} />
        </VStack>
      </Container>
    </>
  );
}

export default App;
