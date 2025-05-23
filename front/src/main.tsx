import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import system from "./theme.ts";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import { ApiProvider } from "./hooks/ApiProvider.tsx";
import { RouterProvider } from "react-router/dom";
import { SocketProvider } from "./hooks/SocketProvider.tsx";
import { ColorModeProvider } from "./components/ui/color-mode.tsx";
import router from "./router.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

import "./i18n.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <ApiProvider>
          <AuthProvider>
            <SocketProvider>
              <Toaster />
              <RouterProvider router={router} />
            </SocketProvider>
          </AuthProvider>
        </ApiProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>,
);
