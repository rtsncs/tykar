import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.ts";
import { AuthProvider } from "./AuthProvider.tsx";
import { ApiProvider } from "./api/ApiProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ApiProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApiProvider>
    </ChakraProvider>
  </StrictMode>,
);
