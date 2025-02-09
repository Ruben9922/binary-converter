import * as R from "ramda";

export interface RadixPreset {
  name: string;
  value: string;
  radix: number | null;
}

export const radixPresets: RadixPreset[] = [
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
    value: "other",
    radix: null,
  },
];

export function getFilteredRadixPresets(signedMode: boolean) {
  return signedMode
    ? R.filter(radixPreset => !signedMode || R.includes(radixPreset.radix, [2, 10]), radixPresets)
    : radixPresets;
}
