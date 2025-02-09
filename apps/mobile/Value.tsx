import * as R from "ramda";
import React from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { computeAllowedDigits, validateValue } from "@binary-converter/core";

type ValueProps = {
  value: string;
  setValue: (value: string) => void;
  isValueDirty: boolean;
  signedMode: boolean;
  inputRadix: number | null;
};

export default function Value({ value, setValue, isValueDirty, signedMode, inputRadix }: ValueProps) {
  const allowedDigits = computeAllowedDigits(inputRadix);

  const helperText = signedMode && inputRadix === 10
    ? `May only contain the following digits: ${R.join(", ", allowedDigits)}. May start with a hyphen (-).`
    : `May only contain the following digits: ${R.join(", ", allowedDigits)}.`;

  const isValid = !isValueDirty || !validateValue(value, inputRadix, signedMode);

  return (
    <View>
      <TextInput
        label="Value"
        value={value}
        onChangeText={setValue}
        error={isValid}
      />
      <HelperText
        type={isValid ? 'info' : 'error'}
        visible={!R.isEmpty(allowedDigits)}
      >
        {helperText}
      </HelperText>
    </View>
  );
}
