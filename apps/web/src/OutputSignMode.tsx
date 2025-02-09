import { FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import React from "react";
import { SignMode } from "@binary-converter/core";
import { validateSignMode } from "@binary-converter/core";
import MotionFormControl from "./MotionFormControl";
import SignModeRadioGroup from "./SignModeRadioGroup";

interface Props {
  outputRadix: number | null;
  signedMode: boolean;
  outputSignMode: SignMode | null;
  setOutputSignMode: (outputSignMode: SignMode | null) => void;
}

function OutputSignMode({ outputRadix, signedMode, outputSignMode, setOutputSignMode }: Props) {
  const errorMessage = validateSignMode(outputSignMode, outputRadix, signedMode);

  return (
    <MotionFormControl
      id="output-sign-mode"
      as="fieldset"
      isInvalid={!!errorMessage}
      key="output-sign-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormLabel as="legend">Output sign mode</FormLabel>
      <SignModeRadioGroup
        signMode={outputSignMode}
        setSignMode={setOutputSignMode}
      />
      <FormHelperText>Select how negative values are represented in the output value.</FormHelperText>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </MotionFormControl>
  );
}

export default OutputSignMode;
