import { Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

function Index() {
  return (
    <Link asChild>
      <ReactRouterLink to="makao">Makao</ReactRouterLink>
    </Link>
  );
}

export default Index;
