import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import system from "./theme.ts";
import { AuthProvider } from "./AuthProvider.tsx";
import { ApiProvider } from "./api/ApiProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { SocketProvider } from "./SocketProvider.tsx";
import { ColorModeProvider } from "./components/ui/color-mode.tsx";
import router from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <ApiProvider>
          <AuthProvider>
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          </AuthProvider>
        </ApiProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>,
);
