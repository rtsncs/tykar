import { Link, VStack } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";

function Index() {
  return (
    <VStack>
      <Link asChild>
        <ReactRouterLink to="makao">Makao</ReactRouterLink>
      </Link>
      <Link asChild>
        <ReactRouterLink to="dice_poker">Dice Poker</ReactRouterLink>
      </Link>
    </VStack>
  );
}

export default Index;
