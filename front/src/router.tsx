import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const App = lazy(() => import("./App.tsx"));
const Index = lazy(() => import("./pages/Index.tsx"));
const MakaoLobby = lazy(() => import("./pages/makao/MakaoLobby.tsx"));
const MakaoRoom = lazy(() => import("./pages/makao/MakaoRoom.tsx"));
const Settings = lazy(() => import("./pages/settings/index.tsx"));
const ErrorPage = lazy(() => import("./error-page.tsx"));
const ConfirmUser = lazy(() => import("./pages/settings/ConfirmUser.tsx"));
const ConfirmEmail = lazy(() => import("./pages/settings/ConfirmEmail.tsx"));
const DicePokerLobby = lazy(
  () => import("./pages/dice_poker/DicePokerLobby.tsx"),
);
const DicePokerRoom = lazy(
  () => import("./pages/dice_poker/DicePokerRoom.tsx"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Index /> },
      { path: "makao", element: <MakaoLobby /> },
      { path: "dice_poker", element: <DicePokerLobby /> },
      { path: "/settings", element: <Settings /> },
      { path: "/settings/confirm_email/:token", element: <ConfirmEmail /> },
      { path: "/confirm/:token", element: <ConfirmUser /> },
    ],
  },
  { path: "makao/:roomId", element: <MakaoRoom /> },
  { path: "dice_poker/:roomId", element: <DicePokerRoom /> },
]);

export default router;
