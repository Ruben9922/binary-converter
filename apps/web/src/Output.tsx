import React from "react";
import { Code, Grid, IconButton, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

interface Props {
  outputValue: string | null;
}

function Output({ outputValue }: Props) {
  const { hasCopied, onCopy } = useClipboard(outputValue ?? "");

  return (
    <Grid
      gridTemplateColumns="1fr auto"
      columnGap={2}
      alignItems="center"
    >
      {outputValue !== null ? (
        <Code fontSize="3xl" noOfLines={10}>
          {outputValue ?? "(invalid input)"}
        </Code>
      ) : (
        <Text fontStyle="italic">
          Output will appear here…
        </Text>
      )}
      <Tooltip
        label={hasCopied ? "Copied!" : "Copy to clipboard"}
        closeOnClick={false}
      >
        <IconButton
          onClick={onCopy}
          disabled={outputValue === null}
          aria-label="Copy to clipboard"
          icon={<CopyIcon />}
        />
      </Tooltip>
    </Grid>
  );
}

export default Output;
