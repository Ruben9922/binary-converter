import React, { useEffect } from "react";
import { Select } from "@chakra-ui/react";
import * as R from "ramda";

interface RadixPreset {
  name: string;
  value: string;
  radix: number | null;
}

// TODO: Refactor to remove value properties
const otherValue = "other";
const allRadixPresets: RadixPreset[] = [
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
  signedMode: boolean;
}

function RadixSelect({ radix, setRadix, signedMode }: Props) {
  const radixPresets = signedMode
    ? R.filter(radixPreset => !signedMode || R.includes(radixPreset.radix, [2, 10]), allRadixPresets)
    : allRadixPresets;

  const radixPresetValueToRadix = (value: string): number | null => R.find(radixPreset => radixPreset.value === value, radixPresets)?.radix ?? null;
  const radixPresetRadixToValue = (radix: number | null): string => R.find(radixPreset => radixPreset.radix === radix, radixPresets)?.value ?? otherValue;

  const fixRadix = () => {
    if (signedMode && radix !== 2 && radix !== 10) {
      setRadix(radixPresets[0].radix);
    }
  };
  useEffect(fixRadix, [radix, radixPresets, setRadix, signedMode]);

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
