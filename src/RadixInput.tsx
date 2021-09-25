import React from "react";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

interface Props {
  radix: number | null,
  setRadix: (updatedRadix: number | null) => void,
  alphabet: string,
}

function RadixInput({ radix, setRadix, alphabet }: Props) {
  return (
    <NumberInput
      value={radix === null || isNaN(radix) ? "" : radix}
      min={1}
      max={alphabet.length}
      onChange={(_, updatedRadix) => setRadix(updatedRadix)}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}

export default RadixInput;
