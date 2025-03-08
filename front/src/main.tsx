import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import system from "./theme.ts";
import { AuthProvider } from "./AuthProvider.tsx";
import { ApiProvider } from "./api/ApiProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import Makao from "./routes/MakaoLobby.tsx";
import Index from "./routes/Index.tsx";
import { SocketProvider } from "./SocketProvider.tsx";
import MakaoRoom from "./routes/MakaoRoom.tsx";
import { ColorModeProvider } from "./components/ui/color-mode.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Index /> },
      { path: "makao", element: <Makao /> },
    ],
  },
  { path: "makao/:roomId", element: <MakaoRoom /> },
]);

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
