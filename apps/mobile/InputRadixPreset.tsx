import React from "react";
import { Text, View } from "react-native";
import { getFilteredRadixPresets } from '@binary-converter/core';
import RadixInput from "./RadixInput.tsx";
import RadixSelect from "./RadixSelect.tsx";

type InputRadixPresetProps = {
  inputRadix: number | null;
  setInputRadix: (inputRadix: number | null) => void,
  signedMode: boolean;
};

export default function InputRadixPreset({inputRadix, setInputRadix, signedMode}: InputRadixPresetProps) {
  const filteredRadixPresets = getFilteredRadixPresets(signedMode);

  return (
    <View>
      <View>
        <RadixSelect
          label="Input radix preset"
          radix={inputRadix}
          setRadix={setInputRadix}
          radixPresets={filteredRadixPresets}
        />

        <RadixInput label="Input radix" radix={} setRadix={} alphabet={} signedMode={} />
      </View>
    </View>
  );
}
