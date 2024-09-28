import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  semanticTokens: {
    colors: {
      error: {
        default: "red.600",
        _dark: "red.400",
      },
    },
  },
});
export default theme;
