import { FormControl, FormErrorMessage, FormHelperText, FormLabel, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import alphabet from "./core/alphabet";
import { getFilteredRadixPresets } from "./core/radixPreset";
import { validateRadix } from "./core/validate";
import RadixInput from "./RadixInput";
import RadixSelect from "./RadixSelect";

interface Props {
  inputRadix: number | null;
  setInputRadix: (inputRadix: number | null) => void,
  signedMode: boolean;
}

function InputRadixPreset({ inputRadix, setInputRadix, signedMode }: Props) {
  const filteredRadixPresets = getFilteredRadixPresets(signedMode);

  return (
    <SimpleGrid columns={2} spacing={2}>
      <FormControl id="input-radix-preset">
        <FormLabel>Input radix preset</FormLabel>
        <RadixSelect
          radix={inputRadix}
          setRadix={setInputRadix}
          filteredRadixPresets={filteredRadixPresets}
        />
      </FormControl>
      <FormControl id="input-radix" isInvalid={!!validateRadix(inputRadix, signedMode)}>
        <FormLabel>Input radix</FormLabel>
        <RadixInput
          radix={inputRadix}
          setRadix={setInputRadix}
          alphabet={alphabet}
          signedMode={signedMode}
        />
        <FormHelperText>
          {signedMode
            ? "Radix must be 2 or 10 in signed mode."
            : "Any integer between 1 and 36 (inclusive)."}
        </FormHelperText>
        <FormErrorMessage>{validateRadix(inputRadix, signedMode)}</FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  );
}

export default InputRadixPreset;
