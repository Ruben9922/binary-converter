import React from "react";
import { Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { SignMode } from "@binary-converter/core";

type SignModeRadioGroupProps = {
  signMode: SignMode | null;
  setSignMode: (signMode: SignMode | null) => void;
};

export default function SignModeRadioGroup({signMode, setSignMode}: SignModeRadioGroupProps) {
  return (
    <RadioButton.Group
      value={signMode ?? ""}
      onValueChange={updatedInputSignMode => setSignMode(updatedInputSignMode as SignMode)}
    >
      <View>
        <Text>Sign and magnitude</Text>
        <RadioButton value="sign-and-magnitude" />
      </View>
      <View>
        <Text>One's complement</Text>
        <RadioButton value="ones-complement" />
      </View>
      <View>
        <Text>Two's complement</Text>
        <RadioButton value="twos-complement" />
      </View>
    </RadioButton.Group>
  );
}
