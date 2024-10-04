import { Heading, Stack } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Stack alignItems="center" m="8">
      <Heading>Error</Heading>
      <p>{error.statusText || error.message}</p>
    </Stack>
  );
}

export default ErrorPage;
