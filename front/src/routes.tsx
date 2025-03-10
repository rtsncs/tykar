import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const App = lazy(() => import("./App.tsx"));
const Index = lazy(() => import("./routes/Index.tsx"));
const Makao = lazy(() => import("./routes/MakaoLobby.tsx"));
const MakaoRoom = lazy(() => import("./routes/MakaoRoom.tsx"));
const ErrorPage = lazy(() => import("./error-page.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      { path: "makao", element: <Makao /> },
    ],
  },
  { path: "makao/:roomId", element: <MakaoRoom /> },
]);

export default router;
