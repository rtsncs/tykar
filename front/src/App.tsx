import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import { Container } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Header />
      <Container
        w={{ base: "100vw", "2xl": "8xl" }}
        maxW="unset"
        centerContent
        mt="4"
      >
        <Outlet />
      </Container>
    </>
  );
}

export default App;
