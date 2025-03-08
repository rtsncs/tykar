import { createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens: {
      colors: {
        error: {
          value: { base: "red.600", _dark: "red.400" },
        },
      },
    },
  },
});

export default system;
