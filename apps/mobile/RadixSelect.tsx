import DropDown from "react-native-paper-dropdown";
import { RadixPreset } from "@binary-converter/core";
import React, { useState } from "react";
import * as R from "ramda";

type RadixSelectProps = {
  label: string;
  radix: number | null;
  setRadix: (updatedRadix: number | null) => void;
  radixPresets: RadixPreset[];
};

export default function RadixSelect({label, radix, setRadix, radixPresets}: RadixSelectProps) {
  const [showDropDown, setShowDropDown] = useState(false);

  const otherRadixPreset = R.find(radixPreset => radixPreset.radix === null, radixPresets)!;
  const radixPresetValueToRadix = (value: string): number | null => R.find(radixPreset => radixPreset.value === value, radixPresets)?.radix ?? otherRadixPreset.radix;
  const radixPresetRadixToValue = (radix: number | null): string => R.find(radixPreset => radixPreset.radix === radix, radixPresets)?.value ?? otherRadixPreset.value;

  const dropDownList = R.map(radixPreset => ({
    label: radixPreset.name,
    value: radixPreset.value,
  }), radixPresets);

  return (
    <DropDown
      label={label}
      mode="outlined"
      visible={showDropDown}
      showDropDown={() => setShowDropDown(true)}
      onDismiss={() => setShowDropDown(false)}
      value={radixPresetRadixToValue(radix)}
      setValue={value => setRadix(radixPresetValueToRadix(value))}
      list={dropDownList}
    />
  );
}
