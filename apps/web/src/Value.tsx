import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import * as R from "ramda";
import React from "react";
import { computeAllowedDigits, validateValue } from "@binary-converter/core";

interface Props {
  value: string;
  setValue: (value: string) => void;
  isValueDirty: boolean;
  signedMode: boolean;
  inputRadix: number | null;
}

function Value({ value, setValue, isValueDirty, signedMode, inputRadix }: Props) {
  const allowedDigits = computeAllowedDigits(inputRadix);

  return (
    <FormControl id="value" isInvalid={isValueDirty && !!validateValue(value, inputRadix, signedMode)}>
      <FormLabel>Value</FormLabel>
      <Input
        value={value}
        placeholder="Enter a value here"
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
      />
      {R.isEmpty(allowedDigits) || (
        <FormHelperText>
          {signedMode && inputRadix === 10
            ? `May only contain the following digits: ${R.join(", ", allowedDigits)}. May start with a hyphen (-).`
            : `May only contain the following digits: ${R.join(", ", allowedDigits)}.`}
        </FormHelperText>
      )}
      <FormErrorMessage>{validateValue(value, inputRadix, signedMode)}</FormErrorMessage>
    </FormControl>
  );
}

export default Value;
