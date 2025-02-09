import React from "react";
import { Text, View } from "react-native";
import { HelperText } from "react-native-paper";
import { SignMode } from "@binary-converter/core";
import { validateSignMode } from "@binary-converter/core";
import SignModeRadioGroup from "./SignModeRadioGroup.tsx";

type InputSignModeProps = {
  inputRadix: number | null;
  signedMode: boolean;
  inputSignMode: SignMode | null;
  setInputSignMode: (inputSignMode: SignMode | null) => void;
};

export default function InputSignMode({inputRadix, signedMode, inputSignMode, setInputSignMode}: InputSignModeProps) {
  const errorMessage = validateSignMode(inputSignMode, inputRadix, signedMode);

  return (
    <View>
      <Text>Input sign mode</Text>
      <SignModeRadioGroup
        signMode={inputSignMode}
        setSignMode={setInputSignMode}
      />
      <HelperText type="info">
        Select how negative values are represented in the input value.
      </HelperText>
      <HelperText type="error" visible={!!errorMessage}>
        {errorMessage}
      </HelperText>
    </View>
  );
}
