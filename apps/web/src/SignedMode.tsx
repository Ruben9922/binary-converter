import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import React from "react";

interface Props {
  signedMode: boolean;
  setSignedMode: (signedMode: boolean) => void;
}

function SignedMode({ signedMode, setSignedMode }: Props) {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="signed-mode" mb="0">
        Signed mode
      </FormLabel>
      <Switch
        id="signed-mode"
        isChecked={signedMode}
        onChange={event => setSignedMode(event.target.checked)}
      />
    </FormControl>
  );
}

export default SignedMode;
