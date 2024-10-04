import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.ts";
import { AuthProvider } from "./AuthProvider.tsx";
import { ApiProvider } from "./api/ApiProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import Makao from "./routes/makao.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [{ path: "makao", element: <Makao /> }],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ApiProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ApiProvider>
    </ChakraProvider>
  </StrictMode>,
);
