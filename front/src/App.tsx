import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import { Container, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";

function App() {
  return (
    <>
      <Header />
      <Container w={{ base: "100vw", "2xl": "8xl" }} maxW="unset" mt="4">
        <Suspense fallback={<Spinner size="xl" />}>
          <Outlet />
        </Suspense>
      </Container>
    </>
  );
}

export default App;
