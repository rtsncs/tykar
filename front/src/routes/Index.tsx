import { Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

function Index() {
  return (
    <Link as={ReactRouterLink} to="makao">
      Makao
    </Link>
  );
}

export default Index;
