import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Grid, Heading, HStack, IconButton, Link, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaGithub } from "react-icons/fa";

interface Props {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}

function TitleBar({ colorMode, toggleColorMode }: Props) {
  return <Grid
    gridTemplateColumns="1fr auto"
    columnGap={2}
    mb={6}
    alignItems="start"
  >
    <Heading>Binary Converter</Heading>
    <HStack>
      <Tooltip label="GitHub repository">
        <Link
          href="https://github.com/Ruben9922/binary-converter"
          isExternal
        >
          <IconButton
            icon={<FaGithub />}
            aria-label="GitHub repository"
          />
        </Link>
      </Tooltip>
      <Tooltip label="Toggle dark mode">
        <IconButton
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle dark mode"
        />
      </Tooltip>
    </HStack>
  </Grid>;
}

export default TitleBar;
