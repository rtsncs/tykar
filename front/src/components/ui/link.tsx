import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink, LinkProps } from "react-router";

export default function Link(props: LinkProps) {
  return (
    <ChakraLink asChild>
      <ReactRouterLink {...props}>{props.children}</ReactRouterLink>
    </ChakraLink>
  );
}
