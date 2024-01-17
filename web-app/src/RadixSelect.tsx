import React from "react";
import { Select } from "@chakra-ui/react";
import * as R from "ramda";
import { RadixPreset, radixPresets } from "./radixPreset";

interface Props {
  radix: number | null;
  setRadix: (updatedRadix: number | null) => void;
  filteredRadixPresets: RadixPreset[];
}

function RadixSelect({ radix, setRadix, filteredRadixPresets }: Props) {
  const otherRadixPreset = R.find(radixPreset => radixPreset.radix === null, radixPresets)!;
  const radixPresetValueToRadix = (value: string): number | null => R.find(radixPreset => radixPreset.value === value, radixPresets)?.radix ?? otherRadixPreset.radix;
  const radixPresetRadixToValue = (radix: number | null): string => R.find(radixPreset => radixPreset.radix === radix, radixPresets)?.value ?? otherRadixPreset.value;

  return (
    <Select
      value={radixPresetRadixToValue(radix)}
      onChange={event => setRadix(radixPresetValueToRadix(event.target.value))}
    >
      {filteredRadixPresets.map(radixPreset => (
        <option key={radixPreset.value} value={radixPreset.value}>
          {radixPreset.name}
        </option>
      ))}
    </Select>
  );
}

export default RadixSelect;
