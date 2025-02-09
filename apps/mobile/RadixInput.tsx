import React from "react";
import { TextInput as ReactNativeTextInput } from "react-native";
import { TextInput } from "react-native-paper";

type RadixInputProps = {
  label: string;
  radix: number | null;
  setRadix: (updatedRadix: number | null) => void;
  alphabet: string;
  signedMode: boolean;
};

export default function RadixInput({label, radix, setRadix, alphabet, signedMode}: RadixInputProps) {
  return (
    <TextInput
      label={label}
      value={radix === null ? "" : radix.toString()}

      render={props => (
        <ReactNativeTextInput
          {...props}
          inputMode="numeric"
        />
      )}
    />
  );
}
