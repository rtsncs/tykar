import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const App = lazy(() => import("./App.tsx"));
const Index = lazy(() => import("./routes/Index.tsx"));
const Makao = lazy(() => import("./routes/MakaoLobby.tsx"));
const MakaoRoom = lazy(() => import("./routes/MakaoRoom.tsx"));
const Settings = lazy(() => import("./routes/Settings.tsx"));
const ErrorPage = lazy(() => import("./error-page.tsx"));
const ConfirmUser = lazy(() => import("./routes/ConfirmUser.tsx"));
const ConfirmEmail = lazy(() => import("./routes/ConfirmEmail.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Index /> },
      { path: "makao", element: <Makao /> },
      { path: "/settings", element: <Settings /> },
      { path: "/settings/confirm_email/:token", element: <ConfirmEmail /> },
      { path: "/confirm/:token", element: <ConfirmUser /> },
    ],
  },
  { path: "makao/:roomId", element: <MakaoRoom /> },
]);

export default router;
