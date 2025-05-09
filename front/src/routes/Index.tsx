import { Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";

function Index() {
  return (
    <>
      <Link asChild>
        <ReactRouterLink to="makao">Makao</ReactRouterLink>
      </Link>
      <Link asChild>
        <ReactRouterLink to="dice_poker">Dice Poker</ReactRouterLink>
      </Link>
    </>
  );
}

export default Index;
