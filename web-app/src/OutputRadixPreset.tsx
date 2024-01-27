import { FormControl, FormErrorMessage, FormHelperText, FormLabel, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import alphabet from "./core/alphabet";
import { getFilteredRadixPresets } from "./core/radixPreset";
import { validateRadix } from "./core/validate";
import RadixInput from "./RadixInput";
import RadixSelect from "./RadixSelect";

interface Props {
  outputRadix: number | null;
  setOutputRadix: (outputRadix: number | null) => void;
  signedMode: boolean;
}

function OutputRadixPreset({ outputRadix, setOutputRadix, signedMode }: Props) {
  const filteredRadixPresets = getFilteredRadixPresets(signedMode);

  return (
    <SimpleGrid columns={2} spacing={2}>
      <FormControl id="output-radix-preset">
        <FormLabel>Output radix preset</FormLabel>
        <RadixSelect
          radix={outputRadix}
          setRadix={setOutputRadix}
          filteredRadixPresets={filteredRadixPresets}
        />
      </FormControl>
      <FormControl id="output-radix" isInvalid={!!validateRadix(outputRadix, signedMode)}>
        <FormLabel>Output radix</FormLabel>
        <RadixInput
          radix={outputRadix}
          setRadix={setOutputRadix}
          alphabet={alphabet}
          signedMode={signedMode}
        />
        <FormHelperText>
          {signedMode
            ? "Radix must be 2 or 10 in signed mode."
            : "Any integer between 1 and 36 (inclusive)."}
        </FormHelperText>
        <FormErrorMessage>{validateRadix(outputRadix, signedMode)}</FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  );
}

export default OutputRadixPreset;
