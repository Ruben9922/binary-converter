import React from "react";
import { Select } from "@chakra-ui/react";
import * as R from "ramda";

interface RadixPreset {
  name: string,
  value: string,
  radix: number | null,
}

const radixPresets: RadixPreset[] = [
  {
    name: "Binary",
    value: "binary",
    radix: 2,
  },
  {
    name: "Decimal",
    value: "decimal",
    radix: 10,
  },
  {
    name: "Hexadecimal",
    value: "hexadecimal",
    radix: 16,
  },
  {
    name: "Other",
    value: "other",
    radix: null,
  },
];

interface Props {
  radix: number | null,
  setRadix: (updatedRadix: number | null) => void,
}

function RadixSelect({ radix, setRadix }: Props) {
  const radixPresetValueToRadix = (value: string): number | null => (R.find(radixPreset => radixPreset.value === value, radixPresets) ?? radixPresets[3]).radix;
  const radixPresetRadixToValue = (radix: number | null): string => (R.find(radixPreset => radixPreset.radix === radix, radixPresets) ?? radixPresets[3]).value;

  return (
    <Select
      value={radixPresetRadixToValue(radix)}
      onChange={event => setRadix(radixPresetValueToRadix(event.target.value))}
    >
      {radixPresets.map(radixPreset => (
        <option value={radixPreset.value}>{radixPreset.name}</option>
      ))}
    </Select>
  );
}

export default RadixSelect;
