import { FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import React from "react";
import { SignMode } from "./core/signMode";
import { validateSignMode } from "./core/validate";
import MotionFormControl from "./MotionFormControl";
import SignModeRadioGroup from "./SignModeRadioGroup";

interface Props {
  inputRadix: number | null;
  signedMode: boolean;
  inputSignMode: SignMode | null;
  setInputSignMode: (inputSignMode: SignMode | null) => void;
}

function InputSignMode({ inputRadix, signedMode, inputSignMode, setInputSignMode }: Props) {
  const errorMessage = validateSignMode(inputSignMode, inputRadix, signedMode);

  return (
    <MotionFormControl
      id="input-sign-mode"
      as="fieldset"
      isInvalid={!!errorMessage}
      key="input-sign-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormLabel as="legend">Input sign mode</FormLabel>
      <SignModeRadioGroup
        signMode={inputSignMode}
        setSignMode={setInputSignMode}
      />
      <FormHelperText>Select how negative values are represented in the input value.</FormHelperText>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </MotionFormControl>
  );
}

export default InputSignMode;
