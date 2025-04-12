import { Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";

function Index() {
  return (
    <Link asChild>
      <ReactRouterLink to="makao">Makao</ReactRouterLink>
    </Link>
  );
}

export default Index;
