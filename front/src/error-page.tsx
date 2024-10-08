import { Heading, Stack } from "@chakra-ui/react";
import { ErrorResponse, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError() as ErrorResponse & Error;
  console.error(error);

  return (
    <Stack alignItems="center" m="8">
      <Heading>Error</Heading>
      {<p>{error.statusText || error.message}</p>}
    </Stack>
  );
}

export default ErrorPage;
