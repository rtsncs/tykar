import { createContext } from "react";
import { Configuration, DefaultApi } from "./gen";

export function createClient() {
  const client = new DefaultApi(
    new Configuration({
      basePath: "http://localhost:3000",
      credentials: "include",
    }),
  );
  return client;
}

export const ApiClient = createContext(createClient());
