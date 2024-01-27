import { Button } from "@chakra-ui/react";
import React from "react";
import { VscArrowSwap } from "react-icons/vsc";

interface Props {
  swap: () => void;
}

function SwapButton({ swap }: Props) {
  return (
    <Button onClick={swap} leftIcon={<VscArrowSwap />} alignSelf="center">
      Swap
    </Button>
  );
}

export default SwapButton;
