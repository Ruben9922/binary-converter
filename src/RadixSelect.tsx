import React from "react";
import { Select } from "@chakra-ui/react";
import * as R from "ramda";

interface RadixPreset {
  name: string;
  value: string;
  radix: number | null;
}

// TODO: Refactor to remove value properties
const otherValue = "other";
const radixPresets: RadixPreset[] = [
  {
    name: "Binary",
    value: "binary",
    radix: 2,
  },
  {
    name: "Octal",
    value: "octal",
    radix: 8,
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
    value: otherValue,
    radix: null,
  },
];

interface Props {
  radix: number | null;
  setRadix: (updatedRadix: number | null) => void;
}

function RadixSelect({ radix, setRadix }: Props) {
  const radixPresetValueToRadix = (value: string): number | null => R.find(radixPreset => radixPreset.value === value, radixPresets)?.radix ?? null;
  const radixPresetRadixToValue = (radix: number | null): string => R.find(radixPreset => radixPreset.radix === radix, radixPresets)?.value ?? otherValue;

  return (
    <Select
      value={radixPresetRadixToValue(radix)}
      onChange={event => setRadix(radixPresetValueToRadix(event.target.value))}
    >
      {radixPresets.map(radixPreset => (
        <option key={radixPreset.value} value={radixPreset.value}>
          {radixPreset.name}
        </option>
      ))}
    </Select>
  );
}

export default RadixSelect;
