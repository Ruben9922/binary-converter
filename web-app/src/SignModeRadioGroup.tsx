import React from "react";
import { HStack, Radio, RadioGroup } from "@chakra-ui/react";
import { SignMode } from "./signMode";

interface Props {
  signMode: SignMode | null;
  setSignMode: (signMode: SignMode | null) => void;
}

function SignModeRadioGroup({ signMode, setSignMode }: Props) {
  return (
    <RadioGroup
      value={signMode ?? undefined}
      onChange={updatedInputSignMode => setSignMode(updatedInputSignMode as SignMode)}
    >
      <HStack spacing="24px">
        <Radio value="sign-and-magnitude">Sign and magnitude</Radio>
        <Radio value="ones-complement">One's complement</Radio>
        <Radio value="twos-complement">Two's complement</Radio>
      </HStack>
    </RadioGroup>
  );
}

export default SignModeRadioGroup;
